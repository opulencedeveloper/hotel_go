import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import ClientProvider from "@/components/ui/ClientProvider";
import { NotificationProvider } from "@/components/notifications/NotificationSystem";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
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
