"use client";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from "recharts";

const data = [
  { metric: "정확도", ensemble: 75, convnext: 74.2, mobilevit: 73.1, beit: 73.8 },
  { metric: "정밀도", ensemble: 73.8, convnext: 72.0, mobilevit: 70.5, beit: 71.2 },
  { metric: "재현율", ensemble: 76.2, convnext: 74.8, mobilevit: 73.8, beit: 74.1 },
  { metric: "F1 Score", ensemble: 75.0, convnext: 73.4, mobilevit: 72.1, beit: 72.6 },
  { metric: "추론속도", ensemble: 50, convnext: 40, mobilevit: 90, beit: 20 },
  { metric: "경량성", ensemble: 55, convnext: 60, mobilevit: 95, beit: 15 },
];

export default function ModelRadarChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold dark:text-white mb-1">모델 종합 성능 레이더</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">정확도·정밀도·재현율·속도·경량성 6개 축 비교</p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ borderRadius: 8 }} formatter={(v) => [`${v}점`]} />
          <Legend />
          <Radar name="앙상블" dataKey="ensemble" stroke="#16a34a" fill="#16a34a" fillOpacity={0.25} strokeWidth={2} />
          <Radar name="MobileViTV2" dataKey="mobilevit" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
          <Radar name="ConvNeXtV2" dataKey="convnext" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 text-center mt-1">추론속도·경량성은 상대적 점수 (100=최고)</p>
    </div>
  );
}
