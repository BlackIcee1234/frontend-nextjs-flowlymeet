import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/navbar/Navbar";
import { Footer } from "@/components/common/footer/footer";

export const metadata: Metadata = {
  title: "Flowlymeet",
  description: "Flowlymeet es una tener llamadas de video con tus amigos y familiares.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
