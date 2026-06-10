"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { latestModels, lightweightResults } from "@/lib/data";
import { Zap } from "lucide-react";

export default function LightweightChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold dark:text-white mb-1">경량화 & 최신 모델 비교</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">MobileViTV2 TorchScript 변환 — 추론 2× 속도 향상</p>

      <div className="flex items-center gap-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
        <Zap size={32} className="text-yellow-500 flex-shrink-0" />
        <div>
          <div className="font-bold dark:text-white">TorchScript 변환 효과</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <strong>36ms</strong> → <strong>18ms</strong> 추론 시간 단축 (2배 빠름) | 정확도 유지: <strong>73.1%</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-sm dark:text-gray-300 mb-3">추론 시간 비교 (ms)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={lightweightResults} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" unit="ms" tick={{ fontSize: 11 }} />
              <YAxis dataKey="model" type="category" width={160} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => [`${v}ms`, "추론시간"]} />
              <Bar dataKey="inference_ms" fill="#f59e0b" radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-semibold text-sm dark:text-gray-300 mb-3">최신 모델 Stage-Aware 비교</h3>
          <div className="space-y-2">
            {latestModels.map((m) => (
              <div key={m.name} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                <div className="font-bold text-sm dark:text-white w-24">{m.name}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{(m.stage_aware_acc * 100).toFixed(1)}%</span>
                    <span>{m.params} | {m.inference_ms}ms</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(m.stage_aware_acc / 0.75) * 100}%` }}
                    />
                  </div>
                </div>
                {m.notes === "경량화 채택" && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">채택</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
