import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareFlow | AI-Powered Patient Triage & Diagnostic Allocation',
  description: 'Enterprise healthcare operations platform for intelligent patient triage, diagnostic allocation, and clinical workflow optimization.',
  keywords: 'healthcare, triage, AI, diagnostics, hospital management, EMR',
  authors: [{ name: 'CareFlow Health Technologies' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
