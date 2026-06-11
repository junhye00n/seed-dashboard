"use client";
import { useState, useEffect } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp, Key, CheckCircle } from "lucide-react";

const INSIGHTS = [
  {
    id: "summary",
    label: "전체 요약",
    emoji: "📊",
    prompt: `당신은 배추 씨앗 AI 연구 전문가입니다. 아래 실험 결과를 바탕으로 한국어로 3문단의 핵심 요약 인사이트를 제공하세요. 각 문단은 2-3문장으로 간결하게.

[실험 결과 요약]
- 데이터셋: 얼갈이(메인 1000장), 봄동, 월동춘채 총 3개 품종
- 발아율: 얼갈이 DC_01→DC_05 70.8%→45.0% (단계별 감소), 월동춘채 93% 이상 안정적
- Baseline 최고 정확도: 62.5% (EfficientNetV2, NextViT)
- Proposal 앙상블(V3+V4+V5) 최종 정확도: 75.0% (+20% 향상)
- XAI 4종(GradCAM/LIME/SHAP/Saliency) 적용으로 판단 근거 시각화
- TorchScript 경량화: 추론 14ms→6.8ms (2.07배 속도 향상)
- 웹 대시보드 Vercel 배포 완료 (15가지 기능)

관점: (1) 핵심 성과 (2) 방법론의 의의 (3) 실용적 가치`,
  },
  {
    id: "ensemble",
    label: "앙상블 전략",
    emoji: "🧩",
    prompt: `배추 씨앗 분류 앙상블 전략을 전문적으로 분석해주세요. 한국어로 3문단.

[앙상블 세부 정보]
- V3: Recall 중심 모델 (Recall=0.86, 가중치 0.35) → 비정상 씨앗 놓치지 않음
- V4: 균형 모델 (Accuracy=0.710, 가중치 0.40) → 전반적 정확도 담당
- V5: Focal Loss 적용 모델 (가중치 0.25) → 어려운 샘플 처리
- Soft Voting 방식으로 확률 평균
- 최적 threshold: 0.59 (기본값 0.5 대비 비대칭 최적화)
- 최종: Accuracy=75%, Precision=75%, Recall=75%, F1=75%, ROC-AUC=78.7%
- Confusion Matrix: TP=75, FP=25, FN=25, TN=75 (200장 테스트)

분석 관점: (1) 각 모델의 역할 분담 (2) threshold 0.59의 의미 (3) 농업 현장에서 Recall 중시 이유`,
  },
  {
    id: "stage",
    label: "Stage-Aware 분석",
    emoji: "🌱",
    prompt: `배추 씨앗 발아 단계(Stage-Aware) 학습의 농업적 의미를 분석해주세요. 한국어로 3문단.

[Stage-Aware 데이터]
- 발아 단계: DC_01(초기) ~ DC_05(후기) 5단계
- 얼갈이 발아율 변화: 70.8% → 65.2% → 55.0% → 42.1% → 45.0%
- 봄동 발아율 변화: 78.6% → 76.2% → 74.8% → 70.1% → 66.7%
- 월동춘채 발아율: 93.6% → 93.5% → 93.8% → 93.3% → 93.0% (매우 안정)
- 얼갈이 비정상률: DC_01 29.2% → DC_05 55.0% (가장 크게 악화)
- ConvNeXtV2/BEiT: Accuracy 75%, ROC-AUC 0.81
- MobileViTV2(채택): Accuracy 71.25%, 추론 14ms (경량화 최적)

분석 관점: (1) 품종별 발아 특성 차이 (2) DC 단계 정보가 모델에 주는 이점 (3) 실제 농업 현장 활용 시나리오`,
  },
  {
    id: "future",
    label: "향후 연구 방향",
    emoji: "🚀",
    prompt: `배추 씨앗 AI 분류 프로젝트의 향후 연구 방향을 제안해주세요. 한국어로 4문단.

[현재 달성 수준]
- 정확도: 75% (앙상블), 경량화 2.07배, 3개 데이터셋, XAI 4종
- 웹 대시보드 배포 완료 (Next.js + Gemini API + RESTful API)
- 한계: 학습 데이터 1000장, 단일 품종 메인 학습, 실제 현장 미검증
- 현재 학술적 방향: 모델 경량화(TorchScript), Stage-Aware, 최신 모델 3개 비교

제안 방향: (1) 데이터 확장 전략(Diffusion 모델 생성, GAN 증강) (2) 고급 기법 적용(Knowledge Distillation, Federated Learning 가능성) (3) 실용화 로드맵(YOLO End-to-End, 모바일 앱, IoT 센서 연동) (4) LLM 연동 확장(GPT-4V, 음성 인터페이스)`,
  },
];

export default function GeminiInsights() {
  const [serverHasKey, setServerHasKey] = useState(false);
  const [localKey, setLocalKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // 서버에 API 키 설정 여부 확인
    fetch("/api/gemini").then(r => r.json()).then(d => {
      setServerHasKey(d.configured ?? false);
    }).catch(() => {});
    // localStorage에서 이전에 저장한 키 불러오기
    const saved = localStorage.getItem("gemini_api_key");
    if (saved) setLocalKey(saved);
  }, []);

  const isReady = serverHasKey || localKey.trim().length > 10;

  const generate = async (tabIndex: number) => {
    const tab = INSIGHTS[tabIndex];
    if (insights[tab.id]) return; // 이미 생성된 경우 재사용
    setLoading(tab.id);
    setError("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: tab.prompt, apiKey: localKey }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsights(prev => ({ ...prev, [tab.id]: data.insight }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "오류 발생");
    }
    setLoading(null);
  };

  const saveKey = () => {
    localStorage.setItem("gemini_api_key", localKey);
    setShowKeyInput(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-6 shadow-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 rounded-xl p-2">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">Gemini AI 인사이트</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {serverHasKey ? (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle size={11} /> 서버 API 키 연결됨
                </span>
              ) : isReady ? (
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <CheckCircle size={11} /> API 키 저장됨
                </span>
              ) : "Google Gemini 1.5 Flash · 무료 API"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!serverHasKey && (
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-lg"
            >
              <Key size={11} /> API 키
            </button>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-gray-600">
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* API 키 입력 (서버 키 없을 때만 표시) */}
      {showKeyInput && !serverHasKey && (
        <div className="flex gap-2 mb-4">
          <input
            type="password"
            placeholder="Gemini API Key (AIza...)"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 dark:text-white"
          />
          <button
            onClick={saveKey}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-2 rounded-lg text-sm"
          >
            저장
          </button>
        </div>
      )}

      {!collapsed && (
        <>
          {/* 인사이트 탭 */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {INSIGHTS.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(i); if (isReady) generate(i); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === i
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                } ${insights[tab.id] ? "ring-2 ring-green-400 ring-offset-1" : ""}`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {loading === tab.id && <Loader2 size={12} className="animate-spin" />}
                {insights[tab.id] && loading !== tab.id && <CheckCircle size={12} className="text-green-400" />}
              </button>
            ))}
          </div>

          {/* API 키 없을 때 안내 */}
          {!isReady && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 mb-3 text-sm text-yellow-800 dark:text-yellow-300">
              <span className="font-bold">API 키 필요</span> — 우측 상단 [API 키] 버튼을 눌러 입력하거나,{" "}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold">
                Google AI Studio
              </a>
              에서 무료 발급 후 입력하세요.
            </div>
          )}

          {/* 생성 버튼 (API 준비됐을 때) */}
          {isReady && !insights[INSIGHTS[activeTab].id] && loading !== INSIGHTS[activeTab].id && (
            <button
              onClick={() => generate(activeTab)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles size={16} /> {INSIGHTS[activeTab].emoji} {INSIGHTS[activeTab].label} 인사이트 생성
            </button>
          )}

          {/* 로딩 */}
          {loading === INSIGHTS[activeTab].id && (
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 py-4 justify-center">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-medium">Gemini가 분석 중입니다...</span>
            </div>
          )}

          {/* 에러 */}
          {error && (
            <div className="text-red-500 text-sm mb-3 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">{error}</div>
          )}

          {/* 결과 */}
          {insights[INSIGHTS[activeTab].id] && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{INSIGHTS[activeTab].emoji}</span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {INSIGHTS[activeTab].label} — Gemini 1.5 Flash 분석
                </span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {insights[INSIGHTS[activeTab].id]}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
