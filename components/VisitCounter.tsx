"use client";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const key = "seed_dashboard_visits";
    const prev = parseInt(localStorage.getItem(key) ?? "0", 10);
    const next = prev + 1;
    localStorage.setItem(key, String(next));
    setCount(next);
  }, []);

  if (count === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
      <Eye size={13} />
      <span>방문 <strong className="text-gray-600 dark:text-gray-300">{count.toLocaleString()}</strong>회</span>
    </div>
  );
}
