import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CustomThemeProvider } from '@/providers/CustomThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { SnackbarProvider } from '@/providers/SnackbarProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'User managerment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <CustomThemeProvider>
          <AuthProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </AuthProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
