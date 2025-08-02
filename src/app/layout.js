import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import ClientAuthWrapper from '@/components/ClientAuthWrapper';
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CourseBuddy",
  description: "CourseBuddy is a user-focused course management platform with progress tracking, admin tools, and role-based access. Built using Next.js and Node.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer/>
        {/* <Navbar/> */}
        <ClientAuthWrapper>
            {children}
        </ClientAuthWrapper>
      </body>
    </html>
  );
}
