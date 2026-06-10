"use client";
import { useState, useRef } from "react";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";

type PredictResult = {
  label: string;
  normal_prob: number;
  abnormal_prob: number;
  stage: string;
  model: string;
  inference_ms: number;
};

export default function ImagePredictor() {
  const [stage, setStage] = useState("DC_03");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const predict = async () => {
    if (!fileRef.current?.files?.[0]) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("image", fileRef.current.files[0]);
    fd.append("stage", stage);
    const res = await fetch("/api/predict", { method: "POST", body: fd });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold dark:text-white mb-1">씨앗 이미지 예측</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">MobileViTV2 TorchScript (Stage-Aware) 모델 사용</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-3">
            <label className="text-sm font-medium dark:text-gray-300 block mb-1">발아 단계 선택</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 dark:text-white"
            >
              {["DC_01","DC_02","DC_03","DC_04","DC_05"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="미리보기" className="max-h-32 mx-auto rounded-lg object-contain" />
            ) : (
              <>
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-500 dark:text-gray-400">씨앗 이미지를 드래그하거나 클릭하여 업로드</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>

          <button
            onClick={predict}
            disabled={!preview || loading}
            className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> 분석 중...</> : "예측 실행"}
          </button>
        </div>

        <div className="flex items-center justify-center">
          {result ? (
            <div className="w-full">
              <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${
                result.label === "정상"
                  ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
                  : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700"
              }`}>
                {result.label === "정상"
                  ? <CheckCircle size={32} className="text-green-600" />
                  : <XCircle size={32} className="text-red-600" />}
                <div>
                  <div className={`text-2xl font-black ${result.label === "정상" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                    {result.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{result.stage} 단계 판정</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1 dark:text-gray-300"><span>정상 확률</span><span className="font-bold">{(result.normal_prob * 100).toFixed(1)}%</span></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full"><div className="h-3 bg-green-500 rounded-full" style={{ width: `${result.normal_prob * 100}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 dark:text-gray-300"><span>비정상 확률</span><span className="font-bold">{(result.abnormal_prob * 100).toFixed(1)}%</span></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full"><div className="h-3 bg-red-500 rounded-full" style={{ width: `${result.abnormal_prob * 100}%` }} /></div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                <div>모델: {result.model}</div>
                <div>추론 시간: {result.inference_ms}ms</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-500">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-sm">이미지를 업로드하고<br/>예측을 실행하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
