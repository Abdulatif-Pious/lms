import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";

import ToasterProvider from "@/components/providers/toaster-provider";
import { ConfettiProvider } from '@/components/providers/confetti-provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Learning management system',
  description: 'you can find a number of interesting learning courses here.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
