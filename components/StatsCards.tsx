"use client";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Zap, Database, Award } from "lucide-react";

function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(ease * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { val, ref };
}

function AnimatedCard({ label, value, sub, icon: Icon, color, badge, numTarget, suffix }: {
  label: string; value?: string; sub: string; icon: React.ElementType;
  color: string; badge?: string; numTarget?: number; suffix?: string;
}) {
  const { val, ref } = useCountUp(numTarget ?? 0);

  return (
    <div ref={ref} className={`relative rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-lg`}>
      {badge && (
        <span className="absolute top-3 right-3 bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <Icon className="mb-3 opacity-80" size={24} />
      <div className="text-3xl font-black mb-1">
        {numTarget !== undefined ? `${val}${suffix ?? ""}` : value}
      </div>
      <div className="text-sm font-semibold opacity-90">{label}</div>
      <div className="text-xs opacity-70 mt-1">{sub}</div>
    </div>
  );
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <AnimatedCard label="앙상블 최종 정확도" numTarget={75} suffix="%" sub="+20% 향상 달성"
        icon={Award} color="from-green-500 to-emerald-600" badge="BEST" />
      <AnimatedCard label="베이스라인 정확도" numTarget={625} suffix="" sub="→ 0.625 EfficientNetV2"
        icon={TrendingUp} color="from-blue-500 to-blue-600" />
      <AnimatedCard label="경량화 속도 향상" value="2× 빠름" sub="TorchScript 변환 후"
        icon={Zap} color="from-yellow-500 to-orange-500" badge="NEW" />
      <AnimatedCard label="학습 데이터" numTarget={1000} suffix="장" sub="3개 데이터셋 통합"
        icon={Database} color="from-purple-500 to-violet-600" />
    </div>
  );
}
