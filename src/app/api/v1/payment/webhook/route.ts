import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { connectDB } from "@/lib/server/utils/db";
import { licenseKeyService } from "@/lib/server/license-key/service";
import { PaymentStatus } from "@/utils/enum";
import Plan from "@/lib/server/plan/entity";
import crypto from "crypto";
import { sendLicenseKeyEmail } from "@/lib/server/utils/email";

async function handler(request: Request) {
  try {
    await connectDB();

    // Log all headers for debugging
    const headers: { [key: string]: string } = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('📋 Webhook headers:', JSON.stringify(headers, null, 2));

    // Get the raw body for signature verification
    const body = await request.text();
    console.log('📦 Raw body length:', body.length);
    console.log('📦 Raw body (first 1000 chars):', body.substring(0, 1000));
    
    // Handle empty body (Flutterwave test/verification requests)
    if (!body || body.trim().length === 0) {
      console.log('ℹ️ Empty webhook body - likely a test/verification request from Flutterwave');
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Webhook received (test/verification)",
        data: null,
      });
    }

    const signature = request.headers.get('verif-hash');

    // Verify webhook signature (Flutterwave sends verif-hash header)
    // Note: Flutterwave webhook verification is optional but recommended for production
    const flutterwaveSecretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    if (signature && flutterwaveSecretHash) {
      if (signature !== flutterwaveSecretHash) {
        console.error('❌ Invalid webhook signature');
        return utils.customResponse({
          status: 401,
          message: MessageResponse.Error,
          description: "Invalid webhook signature",
          data: null,
        });
      }
    }

    // Parse webhook data with error handling
    let webhookData: any;
    try {
      webhookData = JSON.parse(body);
      console.log('✅ Parsed webhook data:', JSON.stringify(webhookData, null, 2).substring(0, 1000));
    } catch (parseError) {
      console.error('❌ Failed to parse webhook body as JSON:', parseError);
      console.error('Raw body:', body.substring(0, 500));
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Invalid webhook payload format",
        data: null,
      });
    }

    // Flutterwave can send webhooks in different formats:
    // 1. { event: "charge.completed", data: {...} }
    // 2. Direct data object: { id: "...", status: "...", ... }
    // 3. Array of events: [{ event: "...", data: {...} }]
    
    let event: string | undefined;
    let data: any;
    
    // Check if it's the standard format
    if (webhookData.event && webhookData.data) {
      event = webhookData.event;
      data = webhookData.data;
    }
    // Check if it's a direct data object (some Flutterwave webhooks send data directly)
    else if (webhookData.id || webhookData.tx_ref || webhookData.status) {
      event = 'charge.completed'; // Assume it's a charge completion
      data = webhookData;
    }
    // Check if it's an array
    else if (Array.isArray(webhookData) && webhookData.length > 0) {
      const firstItem = webhookData[0];
      event = firstItem.event || 'charge.completed';
      data = firstItem.data || firstItem;
    }
    // Otherwise, try to extract from root level
    else {
      event = webhookData.event;
      data = webhookData.data || webhookData;
    }

    // Enhanced logging for debugging
    console.log('📥 Flutterwave webhook received');
    console.log('Extracted Event:', event || 'undefined');
    console.log('Extracted Data:', data ? JSON.stringify(data, null, 2).substring(0, 500) : 'undefined');
    console.log('Transaction ID:', data?.id || data?.transaction_id || data?.flw_ref || 'undefined');
    console.log('Status:', data?.status || 'undefined');
    console.log('Tx Ref:', data?.tx_ref || data?.txRef || 'undefined');

    // Handle different webhook event formats
    // Flutterwave can send different event types and formats
    if (!data) {
      console.warn('⚠️ Webhook missing data after parsing:', { 
        event, 
        hasData: !!data,
        webhookDataKeys: Object.keys(webhookData || {}),
        webhookDataType: typeof webhookData
      });
      // Still acknowledge the webhook to prevent retries
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Webhook received but missing data",
        data: null,
      });
    }
    
    // If event is missing but we have data, assume it's a charge.completed event
    if (!event && data) {
      event = 'charge.completed';
      console.log('ℹ️ Event not found, defaulting to charge.completed');
    }

    // Only process successful payment events
    // Flutterwave can send: 'charge.completed', 'transaction.completed', etc.
    const isChargeCompleted = event === 'charge.completed' || event === 'transaction.completed';
    const isSuccessful = data?.status === 'successful' || data?.status === 'success';
    
    if (isChargeCompleted && isSuccessful) {
      // Flutterwave can send transaction ID in different fields
      const transactionId = data.id?.toString() || 
                           data.transaction_id?.toString() || 
                           data.flw_ref?.toString() ||
                           data.tx_ref;
      const txRef = data.tx_ref || data.txRef;
      
      // Extract licenseKeyId from tx_ref
      let licenseKeyId: string | null = null;
      if (txRef && txRef.startsWith('license_')) {
        const parts = txRef.split('_');
        if (parts.length >= 2) {
          licenseKeyId = parts[1];
        }
      }

      // Get billing period from metadata
      const billingPeriod = data.meta?.billingPeriod || 'yearly';

      if (!billingPeriod || (billingPeriod !== 'yearly' && billingPeriod !== 'quarterly')) {
        console.error('❌ Invalid billing period in webhook:', billingPeriod);
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Invalid billing period",
          data: null,
        });
      }

      // Find license by transaction ID or licenseKeyId
      let license = null;
      if (transactionId) {
        license = await licenseKeyService.findLicenseByTransactionId(transactionId);
      }
      
      if (!license && licenseKeyId) {
        license = await licenseKeyService.findLicenseById(licenseKeyId);
      }

      if (!license) {
        console.error('❌ License not found for transaction:', transactionId);
        return utils.customResponse({
          status: 404,
          message: MessageResponse.Error,
          description: "License not found",
          data: null,
        });
      }

      // Only activate if still pending
      if (license.paymentStatus === PaymentStatus.PENDING) {
        const activatedLicense = await licenseKeyService.activateLicense(
          license._id.toString(),
          null, // userId can be set later
          transactionId,
          billingPeriod as 'yearly' | 'quarterly'
        );

        if (!activatedLicense) {
          console.error('❌ Failed to activate license');
          return utils.customResponse({
            status: 500,
            message: MessageResponse.Error,
            description: "Failed to activate license",
            data: null,
          });
        }

        console.log(`✅ License activated via webhook - ID: ${activatedLicense._id}, Key: ${activatedLicense.licenceKey}`);

        // Fetch plan details to get plan name
        let planName = 'Your Plan';
        try {
          const plan = await Plan.findById(activatedLicense.planId).lean();
          if (plan && plan.name) {
            planName = plan.name;
          }
        } catch (error) {
          console.warn('⚠️ Could not fetch plan name for email:', error);
        }

        // Send license key email to user
        try {
          await sendLicenseKeyEmail({
            email: activatedLicense.email,
            licenseKey: activatedLicense.licenceKey || '',
            planName: planName,
            expiresAt: activatedLicense.expiresAt || new Date(),
            billingPeriod: (activatedLicense.billingPeriod || 'yearly') as 'yearly' | 'quarterly',
          });
          console.log(`📧 License key email sent to ${activatedLicense.email}`);
        } catch (emailError) {
          console.error('❌ Failed to send license key email:', emailError);
          // Don't fail the webhook if email fails - license is already activated
        }

        return utils.customResponse({
          status: 200,
          message: MessageResponse.Success,
          description: "Webhook processed successfully",
          data: {
            licenseKey: activatedLicense.licenceKey,
            expiresAt: activatedLicense.expiresAt,
          },
        });
      } else {
        console.log('ℹ️ License already processed:', license.paymentStatus);
        return utils.customResponse({
          status: 200,
          message: MessageResponse.Success,
          description: "License already processed",
          data: null,
        });
      }
    }

    // For other events, log and acknowledge
    console.log(`ℹ️ Webhook event not processed: ${event} (status: ${data?.status || 'unknown'})`);
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Webhook received but event not processed",
      data: null,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Internal server error",
      data: null,
    });
  }
}

export const POST = utils.withErrorHandling(handler);

