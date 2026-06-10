export const germinationTrend = [
  { stage: "DC_01", bomdong: 12, woldong: 8, eolgari: 15, bomdong_abnormal: 45, woldong_abnormal: 52, eolgari_abnormal: 38 },
  { stage: "DC_02", bomdong: 28, woldong: 22, eolgari: 34, bomdong_abnormal: 38, woldong_abnormal: 44, eolgari_abnormal: 30 },
  { stage: "DC_03", bomdong: 55, woldong: 48, eolgari: 62, bomdong_abnormal: 25, woldong_abnormal: 31, eolgari_abnormal: 20 },
  { stage: "DC_04", bomdong: 74, woldong: 69, eolgari: 78, bomdong_abnormal: 14, woldong_abnormal: 18, eolgari_abnormal: 12 },
  { stage: "DC_05", bomdong: 85, woldong: 80, eolgari: 88, bomdong_abnormal: 8, woldong_abnormal: 11, eolgari_abnormal: 7 },
];

export const vitalitySummary = [
  { dataset: "봄동", avg_germination: 50.8, avg_abnormal: 26.0, peak_stage: "DC_04", samples: 500 },
  { dataset: "월동춘채", avg_germination: 45.4, avg_abnormal: 31.2, peak_stage: "DC_04", samples: 500 },
  { dataset: "얼갈이", avg_germination: 55.4, avg_abnormal: 21.4, peak_stage: "DC_04", samples: 500 },
];

export const modelComparison = [
  { name: "DenseNet121 (Baseline)", accuracy: 0.580, precision: 0.561, recall: 0.603, f1: 0.581, type: "baseline" },
  { name: "ResNet50 (Baseline)", accuracy: 0.595, precision: 0.578, recall: 0.619, f1: 0.598, type: "baseline" },
  { name: "EfficientNetV2 (Baseline)", accuracy: 0.610, precision: 0.594, recall: 0.632, f1: 0.612, type: "baseline" },
  { name: "NextViT (Baseline)", accuracy: 0.588, precision: 0.570, recall: 0.611, f1: 0.590, type: "baseline" },
  { name: "EfficientNetV2 Proposal", accuracy: 0.625, precision: 0.610, recall: 0.648, f1: 0.628, type: "baseline" },
  { name: "Proposal V3 (High Recall)", accuracy: 0.700, precision: 0.658, recall: 0.860, f1: 0.746, type: "proposal" },
  { name: "Proposal V4 (Balanced)", accuracy: 0.715, precision: 0.702, recall: 0.731, f1: 0.716, type: "proposal" },
  { name: "Proposal V5 (Focal Loss)", accuracy: 0.708, precision: 0.695, recall: 0.724, f1: 0.709, type: "proposal" },
  { name: "Ensemble (V3+V4+V5)", accuracy: 0.750, precision: 0.738, recall: 0.762, f1: 0.750, type: "ensemble" },
];

export const latestModels = [
  { name: "ConvNeXtV2", params: "28M", stage_aware_acc: 0.742, inference_ms: 42, memory_mb: 112, notes: "최고 정확도" },
  { name: "MobileViTV2", params: "5.6M", stage_aware_acc: 0.731, inference_ms: 18, memory_mb: 24, notes: "경량화 채택" },
  { name: "BEiT", params: "86M", stage_aware_acc: 0.738, inference_ms: 78, memory_mb: 348, notes: "가장 무거움" },
];

export const lightweightResults = [
  { model: "MobileViTV2 (PyTorch)", inference_ms: 36, size_mb: 24, accuracy: 0.731 },
  { model: "MobileViTV2 (TorchScript)", inference_ms: 18, size_mb: 21, accuracy: 0.731 },
];

export const ensembleDetail = {
  baseline_acc: 0.625,
  ensemble_acc: 0.750,
  improvement_pct: 20.0,
  threshold: 0.59,
  models: [
    { name: "V3", weight: 0.35, recall: 0.860, specialty: "정상 발아 포착" },
    { name: "V4", weight: 0.40, precision: 0.702, specialty: "정밀도/재현율 균형" },
    { name: "V5", weight: 0.25, focus: "Hard samples", specialty: "어려운 샘플 강조" },
  ],
};
