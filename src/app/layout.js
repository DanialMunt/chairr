'use client'
import './globals.css'
import { AuthProvider } from './lib/AuthContext'
import Header from './components/Header'
export default function RootLayout({ children }) {
  return (
     <html lang="en">
        <AuthProvider>
      <body className="flex flex-col min-h-screen bg-[#1F1F1F]">
        <header><Header /></header>
        <main className="flex-1 px-4 xl:px-10">
          {children}
        </main>
      </body>
        </AuthProvider>
    </html>
  )
}


