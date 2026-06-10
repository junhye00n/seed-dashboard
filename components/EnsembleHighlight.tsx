"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { modelComparison, ensembleDetail } from "@/lib/data";
import { TrendingUp } from "lucide-react";

export default function EnsembleHighlight() {
  const chartData = modelComparison.map((m) => ({
    name: m.name.replace(" (Baseline)", "").replace(" (High Recall)", "").replace(" (Balanced)", "").replace(" (Focal Loss)", ""),
    accuracy: Math.round(m.accuracy * 1000) / 10,
    type: m.type,
  }));

  const getColor = (type: string) => {
    if (type === "ensemble") return "#16a34a";
    if (type === "proposal") return "#2563eb";
    return "#9ca3af";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold dark:text-white">앙상블 모델 성능 비교</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Baseline → Proposal → Ensemble 단계별 향상</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl px-5 py-3 text-center">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <TrendingUp size={20} />
            <span className="text-3xl font-black">+20%</span>
          </div>
          <div className="text-xs text-green-600 dark:text-green-500 font-medium">0.625 → 0.750</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" interval={0} />
          <YAxis domain={[50, 80]} unit="%" tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v}%`, "정확도"]} contentStyle={{ borderRadius: 8 }} />
          <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getColor(entry.type)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {ensembleDetail.models.map((m) => (
          <div key={m.name} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
            <div className="text-lg font-black text-blue-600 dark:text-blue-400">{m.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{m.specialty}</div>
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1">가중치 {m.weight}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        최적 threshold: <strong>{ensembleDetail.threshold}</strong> | 초록=앙상블, 파랑=Proposal, 회색=Baseline
      </p>
    </div>
  );
}
