"use client";
import { TrendingUp, Zap, Database, Award } from "lucide-react";

const cards = [
  {
    label: "앙상블 최종 정확도",
    value: "75.0%",
    sub: "+20% 향상 달성",
    icon: Award,
    color: "from-green-500 to-emerald-600",
    badge: "BEST",
  },
  {
    label: "베이스라인 정확도",
    value: "62.5%",
    sub: "EfficientNetV2 Proposal",
    icon: TrendingUp,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "경량화 속도 향상",
    value: "2× 빠름",
    sub: "TorchScript 변환 후",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    badge: "NEW",
  },
  {
    label: "학습 데이터",
    value: "1,000장",
    sub: "3개 데이터셋 통합",
    icon: Database,
    color: "from-purple-500 to-violet-600",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c) => (
        <div key={c.label} className={`relative rounded-2xl bg-gradient-to-br ${c.color} p-5 text-white shadow-lg`}>
          {c.badge && (
            <span className="absolute top-3 right-3 bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">
              {c.badge}
            </span>
          )}
          <c.icon className="mb-3 opacity-80" size={24} />
          <div className="text-3xl font-black mb-1">{c.value}</div>
          <div className="text-sm font-semibold opacity-90">{c.label}</div>
          <div className="text-xs opacity-70 mt-1">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
