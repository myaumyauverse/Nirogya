import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import I18nProvider from "@/components/I18nProvider";

export const metadata: Metadata = {
  title: "Waterborne Disease Awareness",
  description: "An application to predict and spread awareness according to patient's symptoms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Navbar />
          <main className="relative overflow-hidden">
          {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
