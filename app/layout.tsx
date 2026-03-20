import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
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
    <html lang="ru" className={inter.className}>
      <body className="bg-[#F8FAFC] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
