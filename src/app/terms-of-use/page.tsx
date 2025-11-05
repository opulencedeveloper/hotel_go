'use client';

import Navigation from '@/components/home-page/Navigation';
import Footer from '@/components/home-page/Footer';

export default function TermsOfUsePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              HOTELGO — TERMS OF USE
            </h1>
            <div className="text-gray-600 space-y-2 text-sm">
              <p><strong>Effective Date:</strong> November 5th 2025</p>
              <p><strong>Operated by:</strong> SWAD Digital Solutions Ltd ("we," "us," "our"), a subsidiary of SWAD Holdings Ltd.</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing, installing, or using the HotelGo software, website, or mobile applications (collectively, "the Platform"), you agree to be bound by these Terms of Use and our Privacy Policy.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you do not agree, you may not access or use the Platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                HotelGo is intended for business and professional use only by hotels, lodges, and hospitality establishments.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definition of Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                HotelGo provides an integrated hotel management software including, but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Reservation and booking management</li>
                <li>Front desk and guest folio processing</li>
                <li>POS and restaurant management</li>
                <li>Housekeeping and maintenance tracking</li>
                <li>Accounting and payroll functions</li>
                <li>Customer relationship management (CRM)</li>
                <li>Procurement, inventory, and reporting tools</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                The Platform may be provided as a cloud-based, offline, or hybrid system, activated via license keys.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. License Grant and Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 License</h3>
                <p className="text-gray-700 leading-relaxed">
                  SWAD Digital Solutions Ltd grants you a non-exclusive, non-transferable, limited license to use HotelGo solely for managing your hotel or hospitality operations, subject to these Terms.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 License Key</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Each property or group of properties requires a valid license key.</li>
                  <li>You may not share, sell, or duplicate license keys without our prior written consent.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Restrictions</h3>
                <p className="text-gray-700 leading-relaxed mb-2">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Copy, reverse-engineer, modify, or decompile any part of the Platform.</li>
                  <li>Use HotelGo to operate third-party services or resell access.</li>
                  <li>Circumvent payment, license verification, or security systems.</li>
                  <li>Upload any harmful or illegal content.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts and Access</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Each hotel account may include multiple user profiles based on your subscription plan.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">You are responsible for:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Ensuring each user's credentials remain secure.</li>
                <li>All activity that occurs under your hotel's account.</li>
                <li>Assigning access roles and permissions appropriately.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                SWAD Digital Solutions Ltd shall not be liable for unauthorized access resulting from compromised user credentials.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription, Fees & Payment</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>All fees are charged in United States Dollars (USD) or your local currency and billed annually or quarterly, depending on your selected plan.</li>
                <li>Payment confirms continued access to all HotelGo modules and support services during the active term.</li>
                <li>Non-payment or license expiration may result in suspension of access until renewal.</li>
                <li>Fees are non-refundable except where required by law or explicitly stated otherwise.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Ownership and Protection</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>You retain ownership of all data (guest records, transactions, reports) generated through your HotelGo account.</li>
                <li>SWAD Digital Solutions Ltd only processes your data to provide software functionality, support, analytics, and lawful compliance.</li>
                <li>We implement industry-standard security and backup systems; however, you are responsible for maintaining local backups when using the offline version.</li>
                <li>We may anonymize data for aggregated analytics and service improvements.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Updates, Maintenance & Support</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update, enhance, or modify the Platform periodically.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">You agree that:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Updates may require reactivation or internet connection.</li>
                <li>Support services are provided according to your plan (Standard, Priority, or Enterprise SLA).</li>
                <li>We may suspend access for scheduled maintenance or security upgrades, with prior notice where feasible.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All intellectual property rights in HotelGo—including software code, design, content, and documentation—belong to SWAD Digital Solutions Ltd or its licensors.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You acquire no ownership rights, only usage rights as defined by your license.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may suspend or terminate your access immediately if:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>You breach these Terms.</li>
                <li>You fail to pay subscription or licensing fees.</li>
                <li>You engage in fraudulent, abusive, or illegal activity.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon termination, you must stop using HotelGo and remove all installations of the software.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Certain obligations (e.g., data protection, confidentiality, and payment) survive termination.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>SWAD Digital Solutions Ltd is not liable for indirect, incidental, or consequential damages arising from your use or inability to use HotelGo.</li>
                <li>Our total liability in any claim shall not exceed the total amount you paid in the 12 months preceding the claim.</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                HotelGo is provided "as is" and "as available."
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">We do not warrant that:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>The software will be error-free or uninterrupted; or</li>
                <li>It will meet every unique business requirement.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You acknowledge that system performance may depend on your hardware, network, and configuration.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Third-Party Integrations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                HotelGo may integrate with payment processors, accounting software, or other external systems.
              </p>
              <p className="text-gray-700 leading-relaxed">
                SWAD Digital Solutions Ltd is not responsible for third-party content, terms, or failures.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law & Jurisdiction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict of law principles.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any disputes shall be subject to the exclusive jurisdiction of the courts located in Lagos State, Nigeria.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Modifications</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>We may update or revise these Terms at any time.</li>
                <li>The latest version will always be available on our official website.</li>
                <li>Your continued use after changes constitutes acceptance of the updated Terms.</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 font-semibold mb-2">SWAD Digital Solutions Ltd</p>
                <p className="text-gray-700 mb-1">A subsidiary of SWAD Holdings Ltd</p>
                <p className="text-gray-700 mb-1">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@hotelgo.pro" className="text-primary-600 hover:text-primary-700 underline">
                    support@hotelgo.pro
                  </a>
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Website:</strong>{' '}
                  <a href="https://www.hotelgo.pro" className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">
                    www.hotelgo.pro
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Landmark Towers 5b Water Corporation drive,<br />
                  Oniru, Victoria Island, Lagos, Nigeria.
                </p>
              </div>
            </section>
          </div>

          {/* Back to top / Print button */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Top
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Print Page
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

