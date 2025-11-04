import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import ClientProvider from "@/components/ui/ClientProvider";
import { NotificationProvider } from "@/components/notifications/NotificationSystem";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SubscribeModalProvider } from "@/contexts/SubscribeModalContext";
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
        {/* Country detection is now handled in middleware - no client-side script needed */}
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ReduxProvider>
            <SubscribeModalProvider>
              <NotificationProvider>
                <ClientProvider>
                  {children}
                </ClientProvider>
              </NotificationProvider>
            </SubscribeModalProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
