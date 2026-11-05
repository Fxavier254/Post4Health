import React from 'react';
import { Truck, Phone, Navigation, Shield, Thermometer, Clock, Building2, CheckCircle2 } from 'lucide-react';

export default function SimulatedMap({ shipment }) {
  if (!shipment) return null;

  const eta = shipment.etaMinutes !== undefined ? shipment.etaMinutes : 15;
  const isArrivingNow = shipment.status === 'in_transit' && eta <= 0;
  const isDelivered = shipment.status === 'delivered';
  const isBreach = shipment.currentTemp !== null && (shipment.currentTemp < shipment.tempMin || shipment.currentTemp > shipment.tempMax);

  // Dynamic animation duration loop (capped between 5s and 60s for demo)
  const animDuration = Math.max(5, Math.min(eta, 60)) + 's';

  return (
    <div className="bg-[#0f172a] rounded-xl border border-slate-800 text-white overflow-hidden shadow-lg">
      {/* Inline Keyframe Animations for Smooth Truck Movement */}
      <style>{`
        @keyframes driveRoute {
          0% { left: 14%; transform: translateY(-50%); }
          50% { left: 46%; transform: translateY(-62%); }
          100% { left: 78%; transform: translateY(-50%); }
        }
        @keyframes dashMove {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-truck-path {
          animation: driveRoute ${animDuration} linear infinite;
        }
        .animate-dash-route {
          animation: dashMove 1.5s linear infinite;
        }
      `}</style>

      {/* Map Header Overlay */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isArrivingNow || isDelivered ? 'bg-emerald-400' : 'bg-emerald-400 animate-ping'}`} />
          <span className="font-black text-emerald-400 uppercase tracking-wider text-[11px] flex items-center">
            <Navigation className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            LIVE SATELLITE GPS TELEMETRY
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center ${
            isDelivered || isArrivingNow
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
          }`}>
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {isDelivered
              ? 'Delivered'
              : isArrivingNow
              ? 'ARRIVING NOW'
              : `Estimated Arrival: ${eta} mins`}
          </span>
        </div>
      </div>

      {/* Simulated Map Canvas */}
      <div className="relative h-48 bg-slate-950 p-4 flex items-center justify-between overflow-hidden">
        {/* Subtle Map Grid Network Lines Background */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Highway Visual Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 60 96 Q 200 40 380 96"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 60 96 Q 200 40 380 96"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="8 6"
            strokeLinecap="round"
            className="animate-dash-route"
          />
        </svg>

        {/* Left Node: Posta Central Hub */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-[#006b3f] border-2 border-emerald-400 flex items-center justify-center text-white shadow-lg">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-300 mt-1.5 uppercase tracking-wider bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
            Posta Hub
          </span>
        </div>

        {/* MOVING TRUCK VEHICLE ICON */}
        <div
          className={`absolute top-1/2 z-20 flex flex-col items-center pointer-events-none ${
            isDelivered || isArrivingNow ? '' : 'animate-truck-path'
          }`}
          style={
            isDelivered || isArrivingNow
              ? { left: '78%', transform: 'translateY(-50%)' }
              : {}
          }
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>

            <div className="w-11 h-11 rounded-xl bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-2xl">
              <Truck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="bg-slate-900/95 border border-emerald-500/50 px-2 py-0.5 rounded text-center mt-1 shadow-lg whitespace-nowrap">
            <span className="text-[10px] font-bold text-emerald-400 block font-mono">
              {shipment.driverVehicle || "KCF 482L"}
            </span>
            <span className="text-[9px] text-slate-300 font-bold block">
              {isDelivered ? 'Arrived' : isArrivingNow ? 'ARRIVING NOW' : `${eta} mins`}
            </span>
          </div>
        </div>

        {/* Right Node: Destination Hospital */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg border-2 ${
            isDelivered || isArrivingNow
              ? 'bg-emerald-600 border-emerald-300 animate-bounce'
              : 'bg-blue-600 border-blue-400'
          }`}>
            {isDelivered || isArrivingNow ? <CheckCircle2 className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
          <span className="text-[10px] font-extrabold text-slate-300 mt-1.5 uppercase tracking-wider bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 max-w-[120px] truncate text-center">
            {shipment.facility}
          </span>
        </div>
      </div>

      {/* Driver Profile Bar */}
      <div className="bg-slate-900 p-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">ASSIGNED DRIVER</span>
            <span className="font-bold text-white text-xs">{shipment.driverName || shipment.driver}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">CONTACT PHONE</span>
            <a
              href={`tel:${shipment.driverPhone || "+254701112233"}`}
              className="font-mono text-emerald-400 hover:underline font-bold text-xs"
            >
              {shipment.driverPhone || "+254 701 112 233"}
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">LIVE SENSOR READOUT</span>
            <span className={`font-mono font-black text-xs ${isBreach ? 'text-rose-400' : 'text-emerald-400'}`}>
              {shipment.currentTemp !== null ? `${Number(shipment.currentTemp).toFixed(1)} °C` : '--.- °C'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
