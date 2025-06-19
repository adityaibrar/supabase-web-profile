import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Flutter Developer Portfolio | Computer Engineering Graduate',
  description: 'Professional portfolio of a Computer Engineering graduate specializing in Flutter development. Showcasing mobile app projects, technical skills, and professional experience.',
  keywords: 'Flutter developer, Computer Engineering, Mobile app development, Cross-platform, Dart, Firebase, Portfolio',
  authors: [{ name: 'Flutter Developer' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Flutter Developer Portfolio',
    description: 'Professional portfolio showcasing Flutter development expertise and mobile app projects',
    siteName: 'Flutter Developer Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flutter Developer Portfolio',
    description: 'Professional portfolio showcasing Flutter development expertise and mobile app projects',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}