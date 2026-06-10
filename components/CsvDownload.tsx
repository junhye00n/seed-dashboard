"use client";
import { Download } from "lucide-react";
import { germinationTrend, modelComparison, latestModels, lightweightResults } from "@/lib/data";

function toCSV(data: Record<string, unknown>[]): string {
  if (!data.length) return "";
  const headers = Object.keys(data[0]);
  return [headers.join(","), ...data.map((row) => headers.map((h) => row[h]).join(","))].join("\n");
}

const datasets = [
  { label: "발아율 추세", data: germinationTrend, filename: "germination_trend.csv" },
  { label: "모델 비교", data: modelComparison as Record<string, unknown>[], filename: "model_comparison.csv" },
  { label: "최신 모델", data: latestModels as Record<string, unknown>[], filename: "latest_models.csv" },
  { label: "경량화 결과", data: lightweightResults as Record<string, unknown>[], filename: "lightweight_results.csv" },
];

export default function CsvDownload() {
  const download = (csv: string, filename: string) => {
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md">
      <h3 className="font-bold dark:text-white mb-3 flex items-center gap-2">
        <Download size={18} /> 데이터 CSV 다운로드
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {datasets.map(({ label, data, filename }) => (
          <button
            key={filename}
            onClick={() => download(toCSV(data as Record<string, unknown>[]), filename)}
            className="text-left bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 transition-colors"
          >
            <div className="text-sm font-medium dark:text-gray-200">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{filename}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
