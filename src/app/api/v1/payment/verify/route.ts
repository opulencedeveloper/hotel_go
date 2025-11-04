import { utils } from "@/lib/server/utils";
import { MessageResponse } from "@/lib/server/utils/enum";
import { connectDB } from "@/lib/server/utils/db";
import { licenseKeyService } from "@/lib/server/license-key/service";
import { PaymentStatus } from "@/utils/enum";

interface VerifyPaymentBody {
  transaction_id?: string;
  tx_ref?: string;
  status?: string;
}

async function handler(request: Request) {
  try {
    await connectDB();

    const body: VerifyPaymentBody = await request.json();
    const { transaction_id, tx_ref, status } = body;

    // Validate input
    if (!transaction_id && !tx_ref) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "transaction_id or tx_ref is required",
        data: null,
      });
    }

    // Extract licenseKeyId from tx_ref if available
    let licenseKeyId: string | null = null;
    if (tx_ref && tx_ref.startsWith('license_')) {
      const parts = tx_ref.split('_');
      if (parts.length >= 2) {
        licenseKeyId = parts[1];
      }
    }

    // Find license by transaction ID or licenseKeyId
    let license = null;
    if (transaction_id) {
      license = await licenseKeyService.findLicenseByTransactionId(transaction_id);
    }
    
    if (!license && licenseKeyId) {
      license = await licenseKeyService.findLicenseById(licenseKeyId);
    }

    if (!license) {
      return utils.customResponse({
        status: 404,
        message: MessageResponse.Error,
        description: "License not found for this transaction",
        data: null,
      });
    }

    // Check if payment is successful
    const isSuccessful = status === 'successful' || status === 'success';

    if (isSuccessful && license.paymentStatus === PaymentStatus.PENDING) {
      // Get billing period from Flutterwave metadata or license
      // If billingPeriod is in the request body (from Flutterwave webhook), use it
      // Otherwise, use the one stored in the license
      const billingPeriod = (body as any).billingPeriod || license.billingPeriod || 'yearly';

      if (!billingPeriod || (billingPeriod !== 'yearly' && billingPeriod !== 'quarterly')) {
        return utils.customResponse({
          status: 400,
          message: MessageResponse.Error,
          description: "Invalid or missing billing period",
          data: null,
        });
      }

      // Activate the license
      const activatedLicense = await licenseKeyService.activateLicense(
        license._id.toString(),
        null, // userId can be set later when user registers/logs in
        transaction_id || '',
        billingPeriod as 'yearly' | 'quarterly'
      );

      console.log(`✅ License activated - ID: ${activatedLicense._id}, Key: ${activatedLicense.licenceKey}, Expires: ${activatedLicense.expiresAt}`);

      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "Payment verified and license activated successfully",
        data: {
          licenseKey: activatedLicense.licenceKey,
          expiresAt: activatedLicense.expiresAt,
          billingPeriod: activatedLicense.billingPeriod,
        },
      });
    }

    // If payment failed or already processed
    if (!isSuccessful) {
      return utils.customResponse({
        status: 400,
        message: MessageResponse.Error,
        description: "Payment was not successful",
        data: null,
      });
    }

    // License already activated
    if (license.paymentStatus === PaymentStatus.PAID) {
      return utils.customResponse({
        status: 200,
        message: MessageResponse.Success,
        description: "License already activated",
        data: {
          licenseKey: license.licenceKey,
          expiresAt: license.expiresAt,
          billingPeriod: license.billingPeriod,
        },
      });
    }

    return utils.customResponse({
      status: 400,
      message: MessageResponse.Error,
      description: "Unable to process payment verification",
      data: null,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return utils.customResponse({
      status: 500,
      message: MessageResponse.Error,
      description: "Internal server error",
      data: null,
    });
  }
}

export const POST = utils.withErrorHandling(handler);

