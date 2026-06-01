import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/SharedLayout/Navbar";
import Footer from "./components/SharedLayout/Footer";
import { AuthModalProvider } from "./context/AuthModalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bonds Real Estate",
  description: "Building Tomorrow’s Legacy with Vision & Integrity",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthModalProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthModalProvider>{" "}
       
      </body>
    </html>
  );
}
