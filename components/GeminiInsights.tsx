"use client";
import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const PROMPT = `당신은 배추 씨앗 AI 연구 전문가입니다. 다음 실험 결과를 바탕으로 한국어로 3-4문단의 전문적인 인사이트를 제공하세요:

실험 결과:
- 기존 EfficientNetV2 baseline 정확도: 62.5%
- Proposal V3(고재현율 0.86), V4(균형), V5(Focal Loss) 3개 앙상블 → 최종 정확도: 75.0% (+20% 향상)
- 최적 threshold: 0.59 (비대칭 threshold 최적화)
- MobileViTV2 TorchScript 경량화: 추론 36ms → 18ms (2배 속도 향상)
- Stage-aware 학습: DC_01~05 발아 단계 정보 활용
- 3개 데이터셋: 봄동, 월동춘채, 얼갈이(메인)

다음 관점에서 분석해주세요:
1. 앙상블 전략의 효과성과 threshold 최적화의 의미
2. Stage-aware 접근법의 농업적 가치
3. TorchScript 경량화의 실용적 적용 가능성
4. 향후 개선 방향 제안`;

export default function GeminiInsights() {
  const [apiKey, setApiKey] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const generate = async () => {
    if (!apiKey.trim()) { setError("Gemini API 키를 입력해주세요"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: PROMPT, apiKey }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsight(data.insight);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "오류 발생");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-600 rounded-xl p-2">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold dark:text-white">Gemini AI 인사이트</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Google Gemini 1.5 Flash API 연결</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="password"
          placeholder="Gemini API Key (AIza...)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 dark:text-white"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" />생성 중</> : <><Sparkles size={14} />인사이트 생성</>}
        </button>
      </div>

      {error && <div className="text-red-500 text-sm mb-3 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">{error}</div>}

      {insight && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">AI 분석 결과</span>
            <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-gray-600">
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
          {!collapsed && (
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {insight}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        API 키는 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-purple-500 underline">Google AI Studio</a>에서 무료 발급 가능
      </p>
    </div>
  );
}
