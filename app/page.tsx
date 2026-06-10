"use client";
import { useState, useEffect, useCallback } from "react";
import { Moon, Sun, Leaf } from "lucide-react";
import StatsCards from "@/components/StatsCards";
import GerminationChart from "@/components/GerminationChart";
import EnsembleHighlight from "@/components/EnsembleHighlight";
import LightweightChart from "@/components/LightweightChart";
import ImagePredictor from "@/components/ImagePredictor";
import GeminiInsights from "@/components/GeminiInsights";
import PdfEmailPanel from "@/components/PdfEmailPanel";
import CsvDownload from "@/components/CsvDownload";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ModelRadarChart from "@/components/ModelRadarChart";
import ShareButton from "@/components/ShareButton";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import VisitCounter from "@/components/VisitCounter";
import ToastProvider from "@/components/ToastProvider";

export default function Home() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  const triggerPdf = useCallback(async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { jsPDF } = await import("jspdf");
    const el = document.getElementById("dashboard-root");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, logging: false });
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 1.5, canvas.height / 1.5] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width / 1.5, canvas.height / 1.5);
    pdf.save("seed_dashboard_report.pdf");
  }, []);

  return (
    <ToastProvider>
      <ScrollProgressBar />
      <div className="min-h-screen bg-slate-100 dark:bg-gray-950 transition-colors">
        {/* Header */}
        <header className="sticky top-1 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 rounded-xl p-2">
                <Leaf size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                  배추 씨앗 AI 분석 대시보드
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  MobileViTV2 TorchScript | Ensemble 75.0% | Gemini API
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <VisitCounter />
              <ShareButton />
              <PdfEmailPanel />
              <KeyboardShortcuts onDark={toggleDark} onPdf={triggerPdf} />
              <button
                onClick={toggleDark}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="다크모드 (D)"
              >
                {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="dashboard-root" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">배추 씨앗 AI 프로젝트</div>
                <h2 className="text-2xl font-black mb-2">정상/비정상 이미지 분류 시스템</h2>
                <p className="text-sm opacity-90">
                  얼갈이 · 봄동 · 월동춘채 3종 | DC_01~05 발아 단계 | 앙상블 V3+V4+V5 | TorchScript 경량화 | Gemini AI
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black">+20%</div>
                <div className="text-sm opacity-80">정확도 향상</div>
                <div className="text-xs opacity-70">0.625 → 0.750</div>
              </div>
            </div>
          </div>

          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GerminationChart />
            <EnsembleHighlight />
          </div>

          {/* 레이더 차트 추가 */}
          <ModelRadarChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LightweightChart />
            <ImagePredictor />
          </div>

          <div id="gemini-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GeminiInsights />
            </div>
            <div className="space-y-4">
              <CsvDownload />
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md">
                <h3 className="font-bold dark:text-white mb-3">데이터셋 요약</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-600">
                      <th className="pb-2">데이터셋</th>
                      <th className="pb-2">발아율</th>
                      <th className="pb-2">비정상률</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      { name: "봄동", germ: "50.8%", abnorm: "26.0%" },
                      { name: "월동춘채", germ: "45.4%", abnorm: "31.2%" },
                      { name: "얼갈이 ★", germ: "55.4%", abnorm: "21.4%" },
                    ].map((r) => (
                      <tr key={r.name} className="dark:text-gray-300">
                        <td className="py-2 font-medium">{r.name}</td>
                        <td className="py-2 text-green-600 dark:text-green-400 font-bold">{r.germ}</td>
                        <td className="py-2 text-red-500 font-bold">{r.abnorm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-2">★ 얼갈이 = 메인 학습 데이터셋</p>
              </div>
            </div>
          </div>

          {/* XAI Pipeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold dark:text-white mb-4">XAI 분석 파이프라인</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { name: "GradCAM", desc: "CNN 활성화 맵", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" },
                { name: "LIME", desc: "지역 설명 가능성", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
                { name: "SHAP", desc: "기여도 분석", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" },
                { name: "Saliency", desc: "입력 민감도 맵", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
              ].map((x) => (
                <div key={x.name} className={`${x.color} rounded-xl p-4 text-center`}>
                  <div className="text-lg font-black">{x.name}</div>
                  <div className="text-xs mt-1 opacity-80">{x.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {["데이터 전처리", "Baseline 5종 학습", "Proposal V2-V5", "앙상블 최적화", "XAI 분석", "TorchScript 경량화"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-sm dark:text-gray-300 font-medium">{step}</span>
                  {i < 5 && <span className="text-gray-300 dark:text-gray-600 mx-1">→</span>}
                </div>
              ))}
            </div>
          </div>

          <footer className="text-center py-4 text-xs text-gray-400 dark:text-gray-500">
            배추 씨앗 AI 분석 대시보드 | Next.js + Gemini API | Vercel 배포 |{" "}
            <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">?</kbd> 단축키 도움말
          </footer>
        </main>
      </div>
    </ToastProvider>
  );
}
