'use client';
import Header from "./components/Header";
import "./globals.css";
import { AuthProvider } from "./lib/AuthContext";


export default function RootLayout({ children }) {
  return (
    <html lang="en">



      <body className="flex flex-col items-center">
      <AuthProvider>
        <header className="w-full">
          <Header></Header>
        </header>

        <main className="w-full px-10 xl:px-50">
    
          {children}
         
        </main>
        </AuthProvider>
      </body>

    </html>
  );
}
