import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { MockSessionProvider } from "@/context/mock-session";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "matchskills — 東京の演奏家を今すぐ手配",
  description:
    "東京限定。企業イベント・レストラン・ホテルラウンジ・プライベートパーティーのための演奏家即日手配サービス。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <MockSessionProvider>
          <TopNav />
          <main className="flex-1">{children}</main>
          <Footer />
          <RoleSwitcher />
        </MockSessionProvider>
      </body>
    </html>
  );
}
