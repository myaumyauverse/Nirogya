import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PatientProvider } from "@/contexts/PatientContext";

export const metadata: Metadata = {
  title: "Nirogya",
  description: "An application to predict and spread awareness according to patient's symptoms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <LanguageProvider>
          <AuthProvider>
            <PatientProvider>
              <NewsTicker />
              <Navbar />
              <main className="relative overflow-hidden">
              {children}
              </main>
              <Footer />
            </PatientProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
