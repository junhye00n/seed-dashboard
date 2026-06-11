import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const { prompt, apiKey } = await req.json();
  // 서버 환경변수 우선, 없으면 클라이언트에서 받은 키 사용
  const key = process.env.GEMINI_API_KEY || apiKey;
  if (!key) return NextResponse.json({ error: "API 키가 필요합니다" }, { status: 400 });

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ insight: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// 서버에 API 키 설정 여부 확인용
export async function GET() {
  return NextResponse.json({ configured: !!process.env.GEMINI_API_KEY });
}
