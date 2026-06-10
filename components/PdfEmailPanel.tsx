"use client";
import { useState } from "react";
import { FileDown, Mail, Loader2, CheckCircle } from "lucide-react";

export default function PdfEmailPanel() {
  const [emailModal, setEmailModal] = useState(false);
  const [form, setForm] = useState({ to: "", subject: "배추 씨앗 AI 분석 리포트", message: "", gmailUser: "", gmailPass: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const downloadPdf = async () => {
    setPdfLoading(true);
    const { default: html2canvas } = await import("html2canvas");
    const { jsPDF } = await import("jspdf");

    const el = document.getElementById("dashboard-root");
    if (!el) { setPdfLoading(false); return; }

    const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, logging: false });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 1.5, canvas.height / 1.5] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 1.5, canvas.height / 1.5);
    pdf.save("seed_dashboard_report.pdf");
    setPdfLoading(false);
  };

  const sendEmail = async () => {
    setSending(true);
    let pdfBase64 = "";
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const el = document.getElementById("dashboard-root");
      if (el) {
        const canvas = await html2canvas(el, { scale: 1, useCORS: true, logging: false });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdfBase64 = pdf.output("datauristring").split(",")[1];
      }
    } catch {}

    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, pdfBase64 }),
    });
    const data = await res.json();
    setSending(false);
    if (data.success) { setSent(true); setTimeout(() => { setSent(false); setEmailModal(false); }, 2000); }
    else alert("전송 실패: " + data.error);
  };

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={downloadPdf}
          disabled={pdfLoading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
          PDF 저장
        </button>
        <button
          onClick={() => setEmailModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Mail size={16} /> 이메일 전송
        </button>
      </div>

      {emailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold dark:text-white mb-4">리포트 이메일 전송</h3>

            {sent ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle size={48} className="text-green-500" />
                <p className="text-green-600 font-bold">전송 완료!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input placeholder="받는 사람 이메일" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white" />
                <input placeholder="제목" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white" />
                <textarea placeholder="메시지" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3} className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white resize-none" />
                <div className="border-t dark:border-gray-600 pt-3">
                  <p className="text-xs text-gray-400 mb-2">Gmail SMTP 설정 (앱 비밀번호 필요)</p>
                  <input placeholder="Gmail 주소" value={form.gmailUser} onChange={(e) => setForm({ ...form, gmailUser: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm mb-2 dark:bg-gray-700 dark:text-white" />
                  <input type="password" placeholder="Gmail 앱 비밀번호" value={form.gmailPass} onChange={(e) => setForm({ ...form, gmailPass: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setEmailModal(false)} className="flex-1 border dark:border-gray-600 rounded-xl py-2 text-sm dark:text-gray-300">취소</button>
                  <button onClick={sendEmail} disabled={sending} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                    {sending ? <><Loader2 size={14} className="animate-spin" />전송 중</> : "전송"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
