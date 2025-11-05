import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use - HotelGO',
  description: 'Terms of Use for HotelGO hotel management software operated by SWAD Digital Solutions Ltd.',
};

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

