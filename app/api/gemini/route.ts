import { NextRequest, NextResponse } from "next/server";

// 프리셋 인사이트 (API 실패 시 fallback)
const PRESET: Record<string, string> = {
  summary: `본 연구는 배추 씨앗의 정상/비정상 이진 분류 문제를 해결하기 위해 EfficientNetV2 기반의 커스텀 아키텍처(CabbageSeedNet)와 앙상블 전략을 결합한 설명 가능한 AI 프레임워크를 제안합니다. Baseline 5종 대비 최대 20%의 정확도 향상(62.5% → 75.0%)을 달성하였으며, 이는 고재현율 모델, 균형 모델, Focal Loss 모델의 상호 보완적 결합과 비대칭 임계값(0.59) 최적화를 통해 가능했습니다.

XAI 분석(GradCAM·LIME·SHAP·Saliency Map)을 통해 모델이 씨앗의 색 변화, 표면 텍스처 이상, 국소적 손상 영역에 집중하여 판단을 내린다는 사실을 확인하였습니다. 특히 비정상 씨앗의 경우 외부 가장자리의 변색 패턴이 주요 판별 근거로 작동하며, 이는 농업 전문가의 육안 검사 기준과 일치하는 결과입니다.

TorchScript 변환을 통한 MobileViTV2 경량화(2.07배 속도 향상)와 Vercel 기반 웹 대시보드 배포(15가지 기능)를 통해, 연구 결과를 실제 현장에서 활용 가능한 형태로 구현하였습니다. 향후 Diffusion 기반 데이터 증강, Knowledge Distillation, YOLO 기반 End-to-End 파이프라인 연동을 통해 실용성을 더욱 높일 수 있을 것으로 기대됩니다.`,

  ensemble: `앙상블 전략의 핵심은 단일 모델의 편향을 상호 보완하는 다양성(diversity) 확보에 있습니다. V3(가중치 0.35)는 Recall=0.86으로 비정상 씨앗을 놓치지 않는 민감성을 담당하고, V4(가중치 0.40)는 정확도·재현율 균형으로 전반적 안정성을 제공하며, V5(가중치 0.25, Focal Loss)는 경계 샘플 처리 능력을 보완합니다. Soft Voting 방식으로 세 모델의 확률을 가중 평균함으로써 개별 모델 대비 일관성 있는 예측이 가능해졌습니다.

임계값 0.59의 채택은 농업 현장의 비용 비대칭성을 반영한 결정입니다. 비정상 씨앗을 정상으로 잘못 분류하는 거짓 음성(FN)은 발아 실패로 이어져 수확 손실을 야기하지만, 정상 씨앗을 비정상으로 분류하는 거짓 양성(FP)은 단순 폐기 손실에 그칩니다. 0.59로 임계값을 낮춤으로써 Recall을 높이는 방향으로 최적화하였으며, 결과적으로 Precision=Recall=F1=75%의 균형 잡힌 성능을 달성했습니다.

최종 ROC-AUC 0.787은 무작위 분류기(0.5) 대비 57.4%의 변별력 향상을 의미하며, 200장의 테스트셋에서 TP=75, FP=25, FN=25, TN=75의 대칭적 혼동 행렬은 클래스 간 균형잡힌 예측 능력을 시사합니다.`,

  stage: `Stage-Aware 학습은 배추 씨앗의 발아 과정을 DC_01(초기 발아)부터 DC_05(후기 발아)까지 5단계로 세분화하여 각 단계의 특성을 모델 학습에 반영하는 접근입니다. 품종별 발아율 분석 결과, 월동춘채는 DC_01~05 전반에 걸쳐 93% 이상의 안정적 발아율을 유지하는 반면, 얼갈이(메인 데이터셋)는 DC_01의 70.8%에서 DC_05의 45.0%로 급격히 감소하여 가장 높은 환경 민감성을 보입니다.

이러한 발아 단계별 패턴 차이는 단일 임계값 적용의 한계를 보여줍니다. DC_01 초기 단계에서는 씨앗 외형이 유사하여 낮은 판별 기준이 적합하지만, DC_05 후기 단계에서는 비정상 씨앗의 시각적 특징이 뚜렷해져 높은 임계값 적용이 가능합니다. Stage-Aware 학습은 이 발아 단계 정보를 입력 특징으로 통합하여 단계별 최적 판별 기준을 적용할 수 있게 합니다.

농업 현장에서의 실용적 가치는 수확 시점 예측과 품질 관리 자동화에 있습니다. 얼갈이의 경우 DC_03 이후 비정상률이 55%까지 증가하므로, DC_02~03 시점의 조기 진단이 특히 중요하며, 이 시스템을 통해 최적 파종 시기와 발아 단계별 관리 전략을 수립할 수 있습니다.`,

  future: `단기적으로는 현재 한계인 학습 데이터 1,000장 문제를 Diffusion 모델 기반 합성 데이터 생성으로 해결하는 방향이 유망합니다. Stable Diffusion이나 DALL-E 기반의 조건부 이미지 생성을 통해 다양한 비정상 패턴의 합성 씨앗 이미지를 생성하면, 소수 클래스(비정상)의 데이터 불균형 문제도 동시에 해결할 수 있습니다. 또한 Knowledge Distillation을 통해 현재 CabbageSeedNet의 지식을 더 경량화된 모델로 전달하여 모바일 환경에서의 실시간 추론을 가능하게 할 수 있습니다.

중기적으로는 YOLO 기반 End-to-End 파이프라인 통합이 핵심 과제입니다. 현재는 씨앗을 개별적으로 분류하지만, YOLOv8/v9을 활용한 자동 씨앗 탐지→분류 파이프라인을 구축하면 트레이 전체 이미지를 한 번에 처리할 수 있어 실제 선별 공정에 직접 적용 가능합니다. Panoptic Segmentation을 결합하면 씨앗 간 군집도, 접촉 여부, 발아 위치 분포까지 분석하는 정밀 진단이 가능해집니다.

장기적으로는 Federated Learning 기반 다기관 협력 모델 구축과 LLM 연동 자연어 진단 보고서 자동 생성이 실용화 방향의 핵심입니다. 여러 농장에서 수집된 분산 데이터를 프라이버시 보호 하에 통합 학습하고, Gemini/GPT-4V와 연동하여 "씨앗 배치 #247: 비정상률 31.2%, 주요 원인은 외피 갈변 및 수분 손실, 권장 조치: DC_02 단계 이전 재선별"과 같은 전문가 수준의 자연어 진단 보고서를 자동 생성하는 것을 목표로 합니다.`,
};

export async function POST(req: NextRequest) {
  const { prompt, apiKey, topic } = await req.json();
  const key = process.env.GEMINI_API_KEY || apiKey;

  // API 키 있으면 실제 Gemini 호출 시도
  if (key) {
    try {
      // x-goog-api-key 헤더로 직접 fetch (v1 엔드포인트)
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return NextResponse.json({ insight: data.candidates[0].content.parts[0].text, source: "gemini" });
      }
    } catch {
      // 실패 시 fallback으로 계속
    }
  }

  // Fallback: 프리셋 인사이트 반환
  const fallbackKey = topic || "summary";
  const insight = PRESET[fallbackKey] || PRESET.summary;
  return NextResponse.json({ insight, source: "preset" });
}

export async function GET() {
  return NextResponse.json({ configured: !!process.env.GEMINI_API_KEY });
}
