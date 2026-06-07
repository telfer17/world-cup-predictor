import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import NavBar from "@/components/NavBar";
import NavBarGate from "@/components/NavBarGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glasgow Wellington · World Cup 2026 Predictor",
  description:
    "Predict all 72 World Cup 2026 group-stage scores. £10 to enter — half the prize pot, half to the club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBarGate>
          <NavBar />
        </NavBarGate>
        {children}
      </body>
    </html>
  );
}
