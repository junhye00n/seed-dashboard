import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const stage = formData.get("stage") as string ?? "DC_03";

  // Stage-aware mock prediction (simulates MobileViTV2 TorchScript)
  const stageWeights: Record<string, number> = {
    DC_01: 0.62, DC_02: 0.68, DC_03: 0.75, DC_04: 0.82, DC_05: 0.88,
  };
  const base = stageWeights[stage] ?? 0.75;
  const noise = (Math.random() - 0.5) * 0.12;
  const normalProb = Math.min(0.98, Math.max(0.02, base + noise));
  const label = normalProb >= 0.5 ? "정상" : "비정상";

  return NextResponse.json({
    label,
    normal_prob: parseFloat(normalProb.toFixed(4)),
    abnormal_prob: parseFloat((1 - normalProb).toFixed(4)),
    stage,
    model: "MobileViTV2-TorchScript (Stage-Aware)",
    inference_ms: Math.floor(Math.random() * 8 + 14),
  });
}
