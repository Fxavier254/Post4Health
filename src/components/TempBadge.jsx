import React from 'react';
import { Thermometer, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TempBadge({ currentTemp, tempMin, tempMax, showRange = false, size = "md" }) {
  if (currentTemp === undefined || currentTemp === null) {
    return <span className="text-slate-400 text-sm">No data</span>;
  }

  const isBreach = currentTemp < tempMin || currentTemp > tempMax;
  const isClose = !isBreach && (currentTemp <= tempMin + 0.5 || currentTemp >= tempMax - 0.5);

  let bgColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
  let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1" />;

  if (isBreach) {
    bgColor = "bg-rose-50 text-rose-800 border-rose-300 animate-pulse";
    icon = <AlertCircle className="w-4 h-4 text-rose-600 mr-1 animate-bounce" />;
  } else if (isClose) {
    bgColor = "bg-amber-50 text-amber-800 border-amber-300";
    icon = <Thermometer className="w-4 h-4 text-amber-600 mr-1" />;
  }

  const textSize = size === "lg" ? "text-lg font-bold px-3 py-1.5" : size === "sm" ? "text-xs font-semibold px-2 py-0.5" : "text-sm font-semibold px-2.5 py-1";

  return (
    <span className={`inline-flex items-center border rounded-lg ${bgColor} ${textSize}`}>
      {icon}
      <span>{Number(currentTemp).toFixed(1)}°C</span>
      {showRange && (
        <span className="ml-1.5 text-xs text-slate-500 font-normal">
          ({tempMin}–{tempMax}°C)
        </span>
      )}
    </span>
  );
}
