import '../styles/globals.css'

import { Navbar } from '@/components/Navbar'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Metadata } from 'next/types'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: { template: '%s | Thales', default: 'Thales' },
  description: 'Thales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`antialiased ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-gray-50 dark:bg-polar-900">
        <Providers>
          <div className="min-h-screen">
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
