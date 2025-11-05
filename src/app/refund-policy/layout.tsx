import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy - HotelGO',
  description: 'Refund Policy for HotelGO hotel management software operated by SWAD Digital Solutions Ltd.',
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

