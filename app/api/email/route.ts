import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { to, subject, message, gmailUser, gmailPass, pdfBase64 } = await req.json();

  if (!gmailUser || !gmailPass) {
    return NextResponse.json({ error: "Gmail 계정 정보가 필요합니다" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const attachments = pdfBase64
    ? [{ filename: "seed_dashboard_report.pdf", content: pdfBase64, encoding: "base64" }]
    : [];

  try {
    await transporter.sendMail({
      from: gmailUser,
      to,
      subject: subject || "배추 씨앗 AI 분석 리포트",
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#16a34a">🌱 배추 씨앗 AI 분석 대시보드</h2>
        <p>${message || "분석 리포트를 공유합니다."}</p>
        <hr/>
        <p style="color:#666;font-size:12px">본 메일은 배추 씨앗 AI 프로젝트 대시보드에서 자동 발송되었습니다.</p>
      </div>`,
      attachments,
    });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "전송 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
