import { Types } from "mongoose";
import Licence from "./entity";
import { PaymentStatus } from "@/utils/enum";
import Crypto from "crypto";

class LicenseKeyService {
  /**
   * Create a license key entry with pending payment status
   */
  public async createPendingLicense(planId: string, billingPeriod: 'yearly' | 'quarterly', email: string) {
    const license = new Licence({
      planId: new Types.ObjectId(planId),
      paymentStatus: PaymentStatus.PENDING,
      billingPeriod,
      email: email.toLowerCase().trim(),
      userId: null,
      licenceKey: null,
      expiresAt: null,
      flutterwaveTransactionId: null,
    });

    await license.save();
    return license;
  }

  /**
   * Generate a unique production-ready license key
   */
  public generateLicenseKey(): string {
    // Generate a unique license key format: HOTELGO-XXXX-XXXX-XXXX-XXXX
    const segments = [];
    for (let i = 0; i < 4; i++) {
      const segment = Crypto.randomBytes(2).toString('hex').toUpperCase();
      segments.push(segment);
    }
    return `HOTELGO-${segments.join('-')}`;
  }

  /**
   * Calculate expiration date based on billing period
   */
  public calculateExpirationDate(billingPeriod: 'yearly' | 'quarterly'): Date {
    const now = new Date();
    if (billingPeriod === 'yearly') {
      // Add 1 year
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    } else {
      // Add 3 months (quarterly)
      return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
    }
  }

  /**
   * Update license key after successful payment
   */
  public async activateLicense(
    licenseId: string,
    userId: string | null,
    flutterwaveTransactionId: string,
    billingPeriod: 'yearly' | 'quarterly'
  ) {
    // Generate unique license key
    let licenseKey = this.generateLicenseKey();
    
    // Ensure uniqueness (check if key already exists)
    let existingLicense = await Licence.findOne({ licenceKey: licenseKey });
    let attempts = 0;
    while (existingLicense && attempts < 10) {
      licenseKey = this.generateLicenseKey();
      existingLicense = await Licence.findOne({ licenceKey: licenseKey });
      attempts++;
    }

    if (existingLicense) {
      throw new Error('Failed to generate unique license key after multiple attempts');
    }

    const expiresAt = this.calculateExpirationDate(billingPeriod);

    const license = await Licence.findByIdAndUpdate(
      licenseId,
      {
        licenceKey: licenseKey,
        paymentStatus: PaymentStatus.PAID,
        expiresAt,
        userId: userId ? new Types.ObjectId(userId) : null,
        flutterwaveTransactionId,
        billingPeriod,
      },
      { new: true }
    );

    if (!license) {
      throw new Error(`License with ID ${licenseId} not found`);
    }

    return license;
  }

  /**
   * Find license by ID
   */
  public async findLicenseById(licenseId: string) {
    return await Licence.findById(licenseId);
  }

  /**
   * Find license by Flutterwave transaction ID
   */
  public async findLicenseByTransactionId(transactionId: string) {
    return await Licence.findOne({ flutterwaveTransactionId: transactionId });
  }
}

export const licenseKeyService = new LicenseKeyService();

