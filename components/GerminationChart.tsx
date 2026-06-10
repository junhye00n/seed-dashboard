"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { germinationTrend } from "@/lib/data";

export default function GerminationChart() {
  const [mode, setMode] = useState<"germination" | "abnormal">("germination");

  const data = germinationTrend.map((d) =>
    mode === "germination"
      ? { stage: d.stage, 봄동: d.bomdong, 월동춘채: d.woldong, 얼갈이: d.eolgari }
      : { stage: d.stage, 봄동: d.bomdong_abnormal, 월동춘채: d.woldong_abnormal, 얼갈이: d.eolgari_abnormal }
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold dark:text-white">발아율 & 비정상률 추세 분석</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">3개 데이터셋 DC 단계별 변화</p>
        </div>
        <div className="flex gap-2">
          {(["germination", "abnormal"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {m === "germination" ? "발아율 (%)" : "비정상률 (%)"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
          <YAxis unit="%" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: 8 }} />
          <Legend />
          <Line type="monotone" dataKey="봄동" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
          <Line type="monotone" dataKey="월동춘채" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
          <Line type="monotone" dataKey="얼갈이" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} strokeDasharray="5 3" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 mt-2 text-center">얼갈이(빨간선)가 메인 학습 데이터셋 — DC_03 이후 급격한 발아율 상승 확인</p>
    </div>
  );
}
