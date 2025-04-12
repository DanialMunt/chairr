
import Header from "./components/Header";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">



      <body className="flex flex-col items-center">
        <header className="w-full">
          <Header></Header>
        </header>

        <main className="w-full px-10 xl:px-50">
          {children}
        </main>

      </body>

    </html>
  );
}
