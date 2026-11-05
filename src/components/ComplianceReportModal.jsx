import React from 'react';
import { X, ShieldCheck, Thermometer, AlertCircle, Clock, MapPin, Truck } from 'lucide-react';
import { storageService } from '../services/storageService';
import StatusBadge from './StatusBadge';

export default function ComplianceReportModal({ shipment, isOpen, onClose }) {
  if (!isOpen || !shipment) return null;

  const logs = storageService.getTempLogs(shipment.id);
  const issues = storageService.getIssues(shipment.id);

  let minTemp = "N/A";
  let maxTemp = "N/A";
  let breachCount = 0;
  let compliancePercentage = 100;

  if (logs.length > 0) {
    const temps = logs.map(l => l.temperature);
    minTemp = Math.min(...temps).toFixed(1);
    maxTemp = Math.max(...temps).toFixed(1);

    breachCount = logs.filter(l => l.temperature < shipment.tempMin || l.temperature > shipment.tempMax).length;
    compliancePercentage = (((logs.length - breachCount) / logs.length) * 100).toFixed(1);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="bg-[#006b3f] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base">Cold-Chain Audit Matrix</h3>
              <p className="text-xs text-emerald-100">Consignment ID: <span className="font-mono">{shipment.id}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">{shipment.medicine}</span>
                <StatusBadge status={shipment.status} size="sm" />
              </div>
              <p className="flex items-center text-slate-600">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#006b3f] flex-shrink-0" />
                <span><strong>Facility:</strong> {shipment.facility}</span>
              </p>
              <p className="flex items-center text-slate-600">
                <Truck className="w-3.5 h-3.5 mr-1.5 text-[#006b3f] flex-shrink-0" />
                <span><strong>Driver:</strong> {shipment.driver}</span>
              </p>
              <p className="flex items-center text-slate-600">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-[#006b3f] flex-shrink-0" />
                <span><strong>Dispatched:</strong> {new Date(shipment.createdAt).toLocaleString()}</span>
              </p>
            </div>

            {/* Compliance Statistics Box */}
            <div className={`p-3.5 rounded-lg border ${breachCount > 0 ? 'bg-rose-50/70 border-rose-200' : 'bg-emerald-50/70 border-emerald-200'} space-y-2.5`}>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Thermal Range Stats</span>
                <span className="text-slate-500 font-mono text-[10px]">Safe: {shipment.tempMin}°C to {shipment.tempMax}°C</span>
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-md shadow-sm border border-slate-100">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Min Temp</span>
                  <span className="font-mono font-bold text-xs text-slate-800">{minTemp}°C</span>
                </div>
                <div className="bg-white p-2 rounded-md shadow-sm border border-slate-100">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Max Temp</span>
                  <span className="font-mono font-bold text-xs text-slate-800">{maxTemp}°C</span>
                </div>
                <div className="bg-white p-2 rounded-md shadow-sm border border-slate-100">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Compliance</span>
                  <span className={`font-mono font-bold text-xs ${compliancePercentage < 100 ? 'text-rose-600' : 'text-[#006b3f]'}`}>
                    {compliancePercentage}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-slate-600 font-medium">Breach Incidents:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${breachCount > 0 ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'}`}>
                  {breachCount} {breachCount === 1 ? 'incident' : 'incidents'}
                </span>
              </div>
            </div>
          </div>

          {/* Reported Issues if any */}
          {issues.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 space-y-2">
              <h4 className="text-xs font-bold text-rose-900 uppercase flex items-center">
                <AlertCircle className="w-4 h-4 text-rose-600 mr-1.5" />
                Reported Incident Log
              </h4>
              {issues.map(iss => (
                <div key={iss.id || iss.timestamp} className="bg-white p-2.5 rounded-md border border-rose-200 text-xs text-slate-700">
                  <div className="flex items-center justify-between font-bold text-rose-800 mb-0.5">
                    <span className="uppercase text-[11px]">{iss.type}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{new Date(iss.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-600">{iss.notes}</p>
                </div>
              ))}
            </div>
          )}

          {/* Temperature Log History Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center">
              <Thermometer className="w-4 h-4 text-[#006b3f] mr-1.5" />
              Sensor Reading History ({logs.length} readings)
            </h4>

            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No temperature sensor logs recorded yet for this consignment.</p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0">
                    <tr>
                      <th className="px-3.5 py-2 text-left">Timestamp</th>
                      <th className="px-3.5 py-2 text-left">Recorded Temp</th>
                      <th className="px-3.5 py-2 text-left">Thermal Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-mono">
                    {logs.map((log, idx) => {
                      const isOutOfRange = log.temperature < shipment.tempMin || log.temperature > shipment.tempMax;
                      return (
                        <tr key={idx} className={isOutOfRange ? 'bg-rose-50/60' : 'hover:bg-slate-50'}>
                          <td className="px-3.5 py-1.5 text-slate-600">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-3.5 py-1.5 font-bold text-slate-800">
                            {Number(log.temperature).toFixed(1)}°C
                          </td>
                          <td className="px-3.5 py-1.5">
                            {isOutOfRange ? (
                              <span className="inline-flex items-center text-rose-700 font-bold text-[10px] bg-rose-100 px-2 py-0.5 rounded">
                                Breach ({log.temperature < shipment.tempMin ? 'Below Min' : 'Above Max'})
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-emerald-700 font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                                Normal Range
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-[#006b3f] text-white hover:bg-[#005230] transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
