import { Types } from "mongoose";
import Licence from "./entity";
import { PaymentStatus } from "@/utils/enum";
import Crypto from "crypto";

class LicenseKeyService {
  /**
   * Create a license key entry with pending payment status
   */
  public async createPendingLicense(
    planId: string,
    billingPeriod: "yearly" | "quarterly",
    email: string,
    fullName: string
  ) {
    try {
      const license = new Licence({
        planId: new Types.ObjectId(planId),
        paymentStatus: PaymentStatus.PENDING,
        billingPeriod,
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        userId: null,
        licenceKey: null,
        expiresAt: null,
        flutterwaveTransactionId: null,
      });

      await license.save();
      return license;
    } catch (error: any) {
      // Handle duplicate key error for null licenceKey
      // This can happen if the sparse index isn't properly set up
      if (error.code === 11000 && error.keyPattern?.licenceKey === 1) {
        // If there's a duplicate null key error, try to find and reuse existing pending license
        // or retry with a unique identifier
        const existingPending = await Licence.findOne({
          planId: new Types.ObjectId(planId),
          email: email.toLowerCase().trim(),
          paymentStatus: PaymentStatus.PENDING,
          licenceKey: null,
        });

        if (existingPending) {
          return existingPending;
        }

        // If no existing pending license, retry with a temporary unique value
        // This is a workaround for the index issue
        const license = new Licence({
          planId: new Types.ObjectId(planId),
          paymentStatus: PaymentStatus.PENDING,
          billingPeriod,
          email: email.toLowerCase().trim(),
          fullName: fullName.trim(),
          userId: null,
          licenceKey: `TEMP-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          expiresAt: null,
          flutterwaveTransactionId: null,
        });

        await license.save();
        // Set back to undefined after save (this should work with sparse index)
        license.licenceKey = undefined;
        await license.save();
        return license;
      }
      throw error;
    }
  }

  /**
   * Generate a unique production-ready license key
   */
  public generateLicenseKey(): string {
    // Generate a unique license key format: HOTELGO-XXXX-XXXX-XXXX-XXXX
    const segments = [];
    for (let i = 0; i < 4; i++) {
      const segment = Crypto.randomBytes(2).toString("hex").toUpperCase();
      segments.push(segment);
    }
    return `HOTELGO-${segments.join("-")}`;
  }

  /**
   * Calculate expiration date based on billing period
   */
  public calculateExpirationDate(billingPeriod: "yearly" | "quarterly"): Date {
    const now = new Date();
    if (billingPeriod === "yearly") {
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
    billingPeriod: "yearly" | "quarterly"
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
      throw new Error(
        "Failed to generate unique license key after multiple attempts"
      );
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

  public async activateLicenceKey(licenceKey: string, ownerId: Types.ObjectId) {
    const licence = await Licence.findOneAndUpdate(
      {
        licenceKey,
        activated: false,
        userId: null, // Only update if userId is null (not already activated)
      },
      { activated: true, userId: ownerId },
      { new: true }
    );

    return licence;
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

  /**
   * Find license by license key string
   */
  public async findLicenseByKey(licenceKey: string) {
    return await Licence.findOne({ licenceKey });
  }
}

export const licenseKeyService = new LicenseKeyService();
