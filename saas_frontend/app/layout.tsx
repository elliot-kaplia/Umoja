import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import NavbarApp from "./components/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const fredoka = Fredoka({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
  subsets: ["latin"], // Specify the subsets here
});

const nunito = Nunito({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  variable: "--font-nunito",
  display: "swap",
  subsets: ["latin"], // Specify the subsets here
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${fredoka.variable} ${nunito.variable} antialiased flex flex-col`}
      >
        <NavbarApp/>
        {children}
        
      </body>
    </html>
  );
}
