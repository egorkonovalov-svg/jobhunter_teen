import type { Metadata } from 'next'
import { Space_Grotesk, Manrope } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'РаботаТинейджеров — вакансии для подростков 14–18 лет',
  description: 'Найди подработку, стажировку или разовую работу в своём городе. Вакансии для школьников и студентов по всей России.',
  openGraph: {
    title: 'РаботаТинейджеров — вакансии для подростков',
    description: 'Работа для подростков 14–18 лет по всей России',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="bg-warm-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
