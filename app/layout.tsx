import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "배추 씨앗 AI 분석 대시보드",
  description: "배추 씨앗 정상/비정상 이미지 분류 AI 프로젝트 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
