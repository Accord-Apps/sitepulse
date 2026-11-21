import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AuditFlow - Speed & SEO Audit for Business & Devs',
  description: 'Dual-lens speed & technical SEO audit: plain English for business owners, exact specs for developers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
