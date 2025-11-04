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

    // Get the raw body for signature verification
    const body = await request.text();
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

    const webhookData = JSON.parse(body);
    const { event, data } = webhookData;

    console.log('📥 Flutterwave webhook received:', event, data?.id);

    // Only process successful payment events
    if (event === 'charge.completed' && data?.status === 'successful') {
      const transactionId = data.id?.toString() || data.tx_ref;
      const txRef = data.tx_ref;
      
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

    // For other events, just acknowledge
    return utils.customResponse({
      status: 200,
      message: MessageResponse.Success,
      description: "Webhook received",
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

