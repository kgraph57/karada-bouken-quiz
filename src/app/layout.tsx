import type { Metadata } from "next";
import { Zen_Maru_Gothic, Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "からだ冒険クイズ | Dr.おかもん監修",
    template: "%s | からだ冒険クイズ",
  },
  description:
    "あなたの体をめぐる知的冒険。医師監修の人体クイズで「へぇ！」を体験しよう。",
  openGraph: {
    title: "からだ冒険クイズ | Dr.おかもん監修",
    description:
      "あなたの体をめぐる知的冒険。医師監修の人体クイズで「へぇ！」を体験しよう。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenMaruGothic.variable} ${notoSansJP.variable} font-body antialiased`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
