import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import ClientProvider from "@/components/ui/ClientProvider";
import { NotificationProvider } from "@/components/notifications/NotificationSystem";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "HotelGo - Hotel Management System",
  description:
    "Comprehensive hotel management software for modern hospitality businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                  // Send timezone to server to detect country
                  fetch('/api/detect-location?timezone=' + encodeURIComponent(timezone), {
                    method: 'GET',
                    credentials: 'include'
                  }).catch(function() {});
                } catch (e) {
                  console.warn('Timezone detection failed:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ReduxProvider>
            <NotificationProvider>
              <ClientProvider>
                {children}
                <Toaster position="top-right" richColors />
              </ClientProvider>
            </NotificationProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
