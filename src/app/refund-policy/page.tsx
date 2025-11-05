'use client';

import Navigation from '@/components/home-page/Navigation';
import Footer from '@/components/home-page/Footer';

export default function RefundPolicyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              HotelGo Refund Policy
            </h1>
            <div className="text-gray-600 space-y-2 text-sm">
              <p><strong>Effective Date:</strong> 5th November 2025</p>
              <p><strong>Operated by:</strong> SWAD Digital Solutions Ltd</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All payments made for HotelGo software licenses, subscriptions, or related services are final and non-refundable.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By completing your payment, you confirm that you have reviewed our documentation, demo, and product materials before purchase or renewal, and that you are satisfied with the information provided.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. No Refund Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                HotelGo operates strictly on a no-refund basis. Once a license key or subscription has been issued and activated, it is deemed used and non-refundable under all circumstances.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Discretionary Exceptions</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SWAD Digital Solutions Ltd reserves the right, at its sole discretion, to consider a refund only in exceptional cases, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Duplicate or accidental payments.</li>
                <li>Proven unauthorized or fraudulent transactions.</li>
                <li>Major technical errors directly caused by HotelGo that permanently prevent access or usage, verified by our support team.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Refund decisions, if granted, will be made solely by SWAD Digital Solutions Ltd, and may result in partial or full reimbursement depending on the situation.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Evaluation via Demo</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                HotelGo provides a comprehensive demo environment and full product documentation to allow prospective users to test and understand all features before committing to payment.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By proceeding to subscribe or purchase, you acknowledge that you have had adequate opportunity to evaluate the product during the demo phase.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription Renewals</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All subscription renewals (annual, quarterly, or otherwise) are non-refundable once processed.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Users may cancel renewals at any time before the next billing date to avoid future charges.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Interruptions</h2>
              <p className="text-gray-700 leading-relaxed">
                Temporary downtime, maintenance, or feature updates do not constitute grounds for refunds or credits.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For any billing or refund-related inquiries, please contact:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 mb-2">
                  <span className="text-xl mr-2">📧</span>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@swaddigitalsolutions.com" className="text-primary-600 hover:text-primary-700 underline">
                    support@swaddigitalsolutions.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="text-xl mr-2">🌐</span>
                  <strong>Website:</strong>{' '}
                  <a href="https://www.hotelgo.pro" className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">
                    www.hotelgo.pro
                  </a>
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

