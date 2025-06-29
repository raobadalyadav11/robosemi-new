import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RoboSemi - Premium Automation & Electronics Components',
  description: 'Your trusted partner for automation and electronics components. Quality products, competitive prices, and exceptional service for professionals and hobbyists.',
  keywords: 'automation, electronics, arduino, raspberry pi, sensors, actuators, robotics',
  authors: [{ name: 'RoboSemi' }],
  creator: 'RoboSemi',
  publisher: 'RoboSemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}