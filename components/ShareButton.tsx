"use client";
import { Share2 } from "lucide-react";
import { useToast } from "./ToastProvider";

export default function ShareButton() {
  const { show } = useToast();

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "배추 씨앗 AI 분석 대시보드", url });
      } else {
        await navigator.clipboard.writeText(url);
        show("링크가 클립보드에 복사됐습니다!");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      show("링크가 클립보드에 복사됐습니다!");
    }
  };

  return (
    <button
      onClick={share}
      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
      title="링크 공유"
    >
      <Share2 size={16} /> 공유
    </button>
  );
}
