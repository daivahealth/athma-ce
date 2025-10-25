import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Zeal Care Platform',
    template: '%s | Zeal Care',
  },
  description: 'Unified PMS, EHR, and ECM for modern healthcare teams.',
  applicationName: 'Zeal Care Platform',
  keywords: ['healthcare', 'PMS', 'EHR', 'ECM', 'patient management', 'medical records'],
  authors: [{ name: 'Zeal Care' }],
  creator: 'Zeal Care',
  publisher: 'Zeal Care',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
