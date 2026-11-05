import React from 'react';

export default function StatusBadge({ status, size = "md" }) {
  const isSmall = size === "sm";
  const padding = isSmall ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  switch (status) {
    case 'scheduled':
      return (
        <span className={`inline-flex items-center font-extrabold tracking-wider rounded-full border border-blue-300 bg-blue-100 text-blue-900 ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mr-1.5"></span>
          SCHEDULED
        </span>
      );
    case 'in_transit':
      return (
        <span className={`inline-flex items-center font-extrabold tracking-wider rounded-full border border-emerald-300 bg-emerald-100 text-[#006b3f] ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#006b3f] mr-1.5 animate-pulse"></span>
          IN TRANSIT
        </span>
      );
    case 'delivered':
      return (
        <span className={`inline-flex items-center font-extrabold tracking-wider rounded-full border border-emerald-300 bg-emerald-100 text-emerald-950 ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mr-1.5"></span>
          DELIVERED
        </span>
      );
    case 'issue':
      return (
        <span className={`inline-flex items-center font-extrabold tracking-wider rounded-full border border-rose-300 bg-rose-100 text-rose-950 ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-700 mr-1.5"></span>
          ISSUE FLAGGED
        </span>
      );
    case 'pending':
    default:
      return (
        <span className={`inline-flex items-center font-extrabold tracking-wider rounded-full border border-amber-300 bg-amber-100 text-amber-950 ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mr-1.5"></span>
          PENDING
        </span>
      );
  }
}
