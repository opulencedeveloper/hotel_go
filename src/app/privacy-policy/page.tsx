'use client';

import Navigation from '@/components/home-page/Navigation';
import Footer from '@/components/home-page/Footer';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              HOTELGO — PRIVACY POLICY
            </h1>
            <div className="text-gray-600 space-y-2 text-sm">
              <p><strong>Effective Date:</strong> 5th November 2025</p>
              <p><strong>Operated by:</strong> SWAD Digital Solutions Ltd ("we," "us," "our"), a subsidiary of SWAD Holdings Ltd.</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                HotelGo respects your privacy and is committed to protecting personal data belonging to our users, their staff, and guests.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Privacy Policy explains what information we collect, how we use it, and your rights regarding that data when using the HotelGo software, website, or related services ("the Platform").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By installing, accessing, or using HotelGo, you acknowledge that you have read, understood, and agreed to this Privacy Policy.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Scope</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Policy applies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>HotelGo web and mobile applications</li>
                <li>Locally installed offline versions and connected systems</li>
                <li>License activation portals, support platforms, and related websites operated by SWAD Digital Solutions Ltd</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                It covers all users, including hotel owners, administrators, employees, and guests whose information may be processed through HotelGo.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information We Collect</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Information You Provide</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect data you or your authorized users submit directly, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Account details:</strong> Name, email, phone, password, and hotel profile information.</li>
                  <li><strong>Business data:</strong> Property name, address, tax number, and room details.</li>
                  <li><strong>Billing data:</strong> Payment information for subscriptions or license renewals.</li>
                  <li><strong>Staff data:</strong> Employee names, roles, shifts, attendance, and payroll information.</li>
                  <li><strong>Guest data:</strong> Reservation details, identification numbers, contact info, preferences, and folio records.</li>
                  <li><strong>Support communications:</strong> Messages, feedback, or inquiries made via WhatsApp, email, or chat.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Information Collected Automatically</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When online, the Platform may collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Device and browser information (IP address, OS, version, device type).</li>
                  <li>Usage data (module activity, access times, and error logs).</li>
                  <li>License verification data (activation timestamps, version numbers).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Offline Data</h3>
                <p className="text-gray-700 leading-relaxed">
                  In the offline mode, all operational data (reservations, guests, staff, transactions) is stored locally on your device or server.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We do not access or transmit this information unless you enable synchronization or request remote support.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We process collected data to:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                <li>Operate and maintain HotelGo functionality.</li>
                <li>Activate and verify license keys.</li>
                <li>Provide customer support and technical assistance.</li>
                <li>Process billing and manage subscriptions.</li>
                <li>Improve performance, features, and security.</li>
                <li>Generate aggregated analytics (never personally identifiable).</li>
                <li>Comply with legal obligations or respond to lawful requests.</li>
              </ol>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Legal Basis for Processing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We process your data under one or more of the following legal bases:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Contractual necessity:</strong> to deliver the services you subscribed to.</li>
                <li><strong>Legitimate interests:</strong> to maintain system performance and enhance user experience.</li>
                <li><strong>Legal compliance:</strong> to meet applicable laws, tax regulations, or government requests.</li>
                <li><strong>Consent:</strong> when you voluntarily share personal or marketing information.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your data for as long as your HotelGo account or license remains active.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon termination or non-renewal, we may retain limited records (e.g., billing and audit logs) as required by law.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For offline deployments, you are responsible for managing and deleting local data as needed.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to safeguard all user and hotel data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Encrypted communication via HTTPS (for online systems).</li>
                <li>Local data encryption (optional for offline setups).</li>
                <li>Role-based access controls for staff users.</li>
                <li>Routine security audits and backups.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                While we use best efforts, no system is 100% secure. You are encouraged to maintain your own secure backups and restrict system access to authorized staff only.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell or rent your data.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share limited information only in the following cases:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>With payment processors to complete transactions.</li>
                <li>With technical vendors who assist in hosting, analytics, or maintenance (under strict confidentiality).</li>
                <li>To law enforcement or regulators when required by law.</li>
                <li>Within the SWAD Holdings Group for internal business management and compliance.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                All third-party partners are required to comply with equivalent data protection standards.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                HotelGo may process or store data on secure servers located in or outside your country (e.g., in Nigeria or within the EU).
              </p>
              <p className="text-gray-700 leading-relaxed">
                Where applicable, we ensure such transfers are done under appropriate data protection safeguards.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your jurisdiction (including under the NDPR and GDPR), you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Access your personal data.</li>
                <li>Correct inaccurate or outdated information.</li>
                <li>Request deletion of your data where legally permissible.</li>
                <li>Withdraw consent for processing.</li>
                <li>Request a copy of your data in portable format.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Requests should be sent to{' '}
                <a href="mailto:privacy@hotelgo.pro" className="text-primary-600 hover:text-primary-700 underline">
                  privacy@hotelgo.pro
                </a>{' '}
                with sufficient identification.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Cookies & Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our online platforms may use cookies or similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Maintain session continuity.</li>
                <li>Analyze system usage and improve performance.</li>
                <li>Remember user preferences.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can disable cookies through your browser, but some features may become unavailable.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Children's Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                HotelGo is designed for business use only and not intended for individuals under 18 years of age.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not knowingly collect or process data from minors.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Data Backup & Recovery</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You are responsible for maintaining backups of your hotel data (especially in offline mode).
              </p>
              <p className="text-gray-700 leading-relaxed">
                We provide optional backup tools, but you retain full control and responsibility for data stored locally or on your servers.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may revise this Privacy Policy from time to time.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The latest version will always be published on our official website and within the HotelGo app.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Continued use of the Platform after updates constitutes your acceptance of the revised policy.
              </p>
            </section>

            {/* Section 15 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions or wish to exercise your privacy rights, please contact:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 font-semibold mb-2">SWAD Digital Solutions Ltd</p>
                <p className="text-gray-700 mb-1">A subsidiary of SWAD Holdings Ltd</p>
                <p className="text-gray-700 mb-1">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:privacy@hotelgo.pro" className="text-primary-600 hover:text-primary-700 underline">
                    privacy@hotelgo.pro
                  </a>
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Website:</strong>{' '}
                  <a href="https://www.hotelgo.pro" className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">
                    www.hotelgo.pro
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> 5b Water Corporation drive, Oniru, Victoria Island, Lagos, Nigeria.
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

