import React, { useState } from 'react';
import { MapPin, Pill, AlertTriangle, Play, CheckCircle2, Truck, ShieldCheck, Thermometer, Activity, Phone, Calendar, Clock, Bell } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DriverView({
  shipments,
  onStartTrip,
  onOpenMarkDeliveredModal
}) {
  const [activeDriverFilter, setActiveDriverFilter] = useState('Peter Mwangi');

  const driverList = ['Peter Mwangi', 'Grace Wanjiru', 'Samuel Otieno', 'David Kimani'];

  const filteredShipments = shipments.filter(s => {
    if (activeDriverFilter === 'ALL') return true;
    return s.driverName === activeDriverFilter || s.driver === activeDriverFilter;
  });

  const liveTripsCount = filteredShipments.filter(s => s.status === 'in_transit').length;

  const breachShipments = filteredShipments.filter(
    s => s.status === 'in_transit' && s.currentTemp !== null && (s.currentTemp < s.tempMin || s.currentTemp > s.tempMax)
  );

  const isScheduledInFuture = (scheduledDate, scheduledTime) => {
    if (!scheduledDate) return false;
    const now = new Date();
    const timeStr = scheduledTime || '00:00';
    const scheduledDateTime = new Date(`${scheduledDate}T${timeStr}`);
    if (isNaN(scheduledDateTime.getTime())) return false;
    return scheduledDateTime > now;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-black text-[#006b3f] uppercase tracking-wider block">
            DRIVER CONSOLE &bull; LOGISTICS DISPATCH
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Driver Assigned Consignments
          </h2>
          <p className="text-xs font-semibold text-slate-700 mt-1 max-w-xl">
            View scheduled deliveries and start trips when due to initiate live sensor telemetry & receiver alerts.
          </p>
        </div>

        <div className="self-start sm:self-center flex flex-col items-end gap-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-lg text-xs font-extrabold text-[#006b3f]">
            <Thermometer className="w-4 h-4 text-[#006b3f]" />
            <span>{liveTripsCount} active sensor stream(s)</span>
          </div>
        </div>
      </div>

      {/* Driver Switcher Pills */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-[#006b3f]" />
          <span className="text-xs font-black text-slate-900">Select Active Driver:</span>
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveDriverFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
              activeDriverFilter === 'ALL'
                ? 'bg-[#006b3f] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Consignments
          </button>
          {driverList.map(drv => (
            <button
              key={drv}
              onClick={() => setActiveDriverFilter(drv)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition whitespace-nowrap ${
                activeDriverFilter === drv
                  ? 'bg-[#006b3f] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {drv}
            </button>
          ))}
        </div>
      </div>

      {/* Red Alert Banner if Temperature Breach Detected */}
      {breachShipments.length > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-xs text-rose-950 uppercase tracking-wide">
                CRITICAL TEMPERATURE BREACH DETECTED
              </h3>
              {breachShipments.map(s => (
                <p key={s.id} className="text-xs text-rose-900 font-bold mt-1">
                  <strong>{s.facility}</strong> — Recorded {Number(s.currentTemp).toFixed(1)}°C (Safe limit: {s.tempMin} to {s.tempMax}°C). Transfer cargo to validated cold box!
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shipment Cards List */}
      <div className="space-y-5">
        {filteredShipments.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-xs font-bold text-slate-600">
            No consignments assigned to {activeDriverFilter}.
          </div>
        ) : (
          filteredShipments.map((shipment) => {
            const isScheduled = shipment.status === 'scheduled';
            const isPending = shipment.status === 'pending';
            const isInTransit = shipment.status === 'in_transit';
            const isDelivered = shipment.status === 'delivered';
            const isBreach = isInTransit && shipment.currentTemp !== null && (shipment.currentTemp < shipment.tempMin || shipment.currentTemp > shipment.tempMax);

            const isFuture = (isScheduled || isPending) && isScheduledInFuture(shipment.scheduledDate, shipment.scheduledTime);
            const isDueTodayOrPast = (isScheduled || isPending) && !isFuture;

            return (
              <div
                key={shipment.id}
                className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${
                  isBreach
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : isDueTodayOrPast
                    ? 'border-amber-400 ring-1 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top Row: ID + Scheduled Info + Status Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center text-[#006b3f]">
                      <Activity className="w-4 h-4 text-[#006b3f]" />
                    </div>
                    <span className="font-mono text-xs font-extrabold text-slate-800">
                      {shipment.id}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {shipment.scheduledDate && (
                      <span className="hidden sm:inline-flex items-center text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 font-mono">
                        <Calendar className="w-3 h-3 mr-1 text-[#006b3f]" />
                        {shipment.scheduledDate} {shipment.scheduledTime || ''}
                      </span>
                    )}
                    <StatusBadge status={shipment.status} />
                  </div>
                </div>

                {/* Due Today / Past Reminder Amber Banner */}
                {isDueTodayOrPast && (
                  <div className="mt-3 bg-amber-100 border border-amber-300 rounded-lg p-3 text-amber-950 font-extrabold text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-amber-800 animate-bounce" />
                      <span>Reminder: Delivery due today!</span>
                    </div>
                    <span className="font-mono text-amber-900 text-[11px] bg-amber-200 px-2 py-0.5 rounded">
                      Scheduled: {shipment.scheduledDate} {shipment.scheduledTime || ''}
                    </span>
                  </div>
                )}

                {/* Middle Section: Facility & Medicine Info */}
                <div className="mt-4">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {shipment.facility}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center mt-0.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500 flex-shrink-0" />
                    <span>{shipment.address}</span>
                  </p>
                </div>

                {/* Payload & Digital Temperature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Payload Box */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center">
                        <Pill className="w-3.5 h-3.5 mr-1 text-slate-600" />
                        MEDICAL PAYLOAD
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1">
                        {shipment.medicine}
                      </h4>
                    </div>
                    <div className="mt-3">
                      <span className="inline-block bg-white border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1 rounded-md">
                        Range: {shipment.tempMin}°C to {shipment.tempMax}°C
                      </span>
                    </div>
                  </div>

                  {/* Digital Sensor Display Box */}
                  <div className={`p-4 rounded-lg border flex flex-col justify-between ${
                    isBreach
                      ? 'bg-rose-50 border-rose-300'
                      : isInTransit
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center">
                        <Thermometer className="w-3.5 h-3.5 mr-1 text-slate-600" />
                        DIGITAL TELEMETRY
                      </span>
                      {isBreach && (
                        <span className="text-xs font-black bg-rose-600 text-white px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>BREACH</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      {isScheduled || isPending ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-2xl font-bold text-slate-400">
                            --.- °C
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-200 px-2 py-0.5 rounded">
                            Awaiting Dispatch
                          </span>
                        </div>
                      ) : (
                        <span className={`font-mono text-2xl font-black ${
                          isBreach ? 'text-rose-600' : 'text-[#006b3f]'
                        }`}>
                          {Number(shipment.currentTemp).toFixed(1)} °C
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Driver Details & Handover Bar */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-slate-800">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center">
                      <Truck className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
                      <span>Driver: <strong className="text-slate-900">{shipment.driverName || shipment.driver}</strong></span>
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                      <a href={`tel:${shipment.receiverPhone || "0702896052"}`} className="font-mono text-emerald-800 hover:underline">
                        Receiver: {shipment.receiverName || "Officer"} ({shipment.receiverPhone || "0702896052"})
                      </a>
                    </span>
                    <span className="flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-600" />
                      Pin: <strong className="font-mono text-slate-950 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{shipment.confirmationCode}</strong>
                    </span>
                  </div>

                  {/* Button Action Logic */}
                  <div className="flex items-center justify-end">
                    {/* Future Scheduled: Disabled Button */}
                    {isFuture && (
                      <button
                        disabled
                        className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-600 font-extrabold text-xs cursor-not-allowed border border-slate-300 flex items-center space-x-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Scheduled for {shipment.scheduledDate}</span>
                      </button>
                    )}

                    {/* Due Today or Past Scheduled / Pending: Active Start Trip Button */}
                    {isDueTodayOrPast && (
                      <button
                        onClick={() => onStartTrip(shipment.id)}
                        className="px-5 py-2.5 rounded-lg bg-[#006b3f] hover:bg-[#005230] text-white font-extrabold text-xs shadow-sm transition flex items-center space-x-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start Trip</span>
                      </button>
                    )}

                    {/* In Transit: Mark Delivered Button */}
                    {isInTransit && (
                      <button
                        onClick={() => onOpenMarkDeliveredModal(shipment)}
                        className="px-5 py-2.5 rounded-lg bg-[#006b3f] hover:bg-[#005230] text-white font-extrabold text-xs shadow-sm transition flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Mark Delivered</span>
                      </button>
                    )}

                    {/* Delivered: Completed */}
                    {isDelivered && (
                      <span className="text-xs font-extrabold text-slate-500 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
