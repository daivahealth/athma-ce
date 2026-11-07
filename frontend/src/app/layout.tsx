import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Athma',
    template: '%s | Athma',
  },
  description: 'Unified PMS, EHR, and ECM for modern healthcare teams.',
  applicationName: 'Athma',
  keywords: ['healthcare', 'PMS', 'EHR', 'ECM', 'patient management', 'medical records'],
  authors: [{ name: 'Athma' }],
  creator: 'Athma',
  publisher: 'Athma',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    // The sized PNG is the legacy/Safari fallback; browsers that support SVG favicons
    // prefer the scalable one, which also switches the "a" to light on dark tab bars.
    icon: [
      { url: '/icon', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: '/apple-icon',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary`}>
        {children}
      </body>
    </html>
  );
}
