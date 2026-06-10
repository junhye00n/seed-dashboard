"use client";
import { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";

type Props = { onDark: () => void; onPdf: () => void };

const shortcuts = [
  { key: "D", desc: "다크모드 전환" },
  { key: "P", desc: "PDF 저장" },
  { key: "C", desc: "CSV 전체 다운로드" },
  { key: "G", desc: "Gemini 인사이트로 이동" },
  { key: "?", desc: "단축키 도움말" },
];

export default function KeyboardShortcuts({ onDark, onPdf }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "d" || e.key === "D") onDark();
      if (e.key === "p" || e.key === "P") onPdf();
      if (e.key === "g" || e.key === "G") document.getElementById("gemini-section")?.scrollIntoView({ behavior: "smooth" });
      if (e.key === "?" || e.key === "/") setOpen((v) => !v);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDark, onPdf]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="키보드 단축키 (?)"
      >
        <Keyboard size={18} className="text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <Keyboard size={18} /> 키보드 단축키
              </h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map(({ key, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm dark:text-gray-300">{desc}</span>
                  <kbd className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-gray-300 dark:border-gray-600">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">입력창 포커스 중엔 작동하지 않습니다</p>
          </div>
        </div>
      )}
    </>
  );
}
