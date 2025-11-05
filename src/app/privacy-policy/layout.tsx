import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - HotelGO',
  description: 'Privacy Policy for HotelGO hotel management software operated by SWAD Digital Solutions Ltd.',
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

