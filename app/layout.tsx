import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Hotel_Management_System',
  description: 'Created with Fadumo Ahmed Ali',
  generator: 'Hotel Management System',
  icons: {
    icon: [
      {
        url: '/fay.jpeg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/fay.jpeg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/fay.jpeg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/fay.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
