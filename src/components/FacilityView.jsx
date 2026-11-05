import React from 'react';
import { Building2, ShieldCheck, Truck, Clock, CheckCircle2, Phone, MapPin, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import SimulatedMap from './SimulatedMap';

export default function FacilityView({
  facilities,
  shipments,
  onOpenConfirmReceiptModal,
  onOpenReportIssueModal
}) {
  const [selectedFacility, setSelectedFacility] = React.useState(facilities[0]?.name || 'Aga Khan University Hospital');

  const facilityShipments = shipments.filter(s => s.facility === selectedFacility);
  const incomingShipments = facilityShipments.filter(s => s.status === 'scheduled' || s.status === 'pending' || s.status === 'in_transit');
  const receivedShipments = facilityShipments.filter(s => s.status === 'delivered' || s.status === 'issue');
  const inTransitShipment = incomingShipments.find(s => s.status === 'in_transit') || incomingShipments[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-black text-[#006b3f] uppercase tracking-wider block">
            FACILITY RECEIVING DESK
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {selectedFacility}
          </h2>
          <p className="text-xs font-semibold text-slate-700 mt-1 max-w-2xl">
            {inTransitShipment
              ? `Estimated Arrival: ${inTransitShipment.etaMinutes || 15} mins · ${inTransitShipment.medicine}. Driver: ${inTransitShipment.driverName || inTransitShipment.driver} (${inTransitShipment.driverPhone || '+254 701 112 233'}). Assigned Receiver: ${inTransitShipment.receiverName || 'Pharmacy Officer'} (${inTransitShipment.receiverPhone || '0702896052'}).`
              : 'All scheduled incoming medical consignments have been received and verified.'}
          </p>
        </div>

        <div className="self-start sm:self-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-lg text-xs font-extrabold text-[#006b3f]">
            <Building2 className="w-4 h-4 text-[#006b3f]" />
            <span>{incomingShipments.length} En Route / Scheduled</span>
          </div>
        </div>
      </div>

      {/* Facility Selection Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 no-scrollbar">
        {facilities.map((f) => {
          const isActive = selectedFacility === f.name;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFacility(f.name)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#006b3f] text-white shadow-sm'
                  : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
            >
              {f.name}
            </button>
          );
        })}
      </div>

      {/* SIMULATED LIVE MAP (Facility View) */}
      {inTransitShipment && inTransitShipment.status === 'in_transit' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#006b3f]" />
              SIMULATED LIVE VEHICLE TRACKING MAP
            </h3>
            <span className="text-[11px] font-extrabold text-[#006b3f] font-mono bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
              Live GPS Sync Active
            </span>
          </div>
          <SimulatedMap shipment={inTransitShipment} />
        </div>
      )}

      {/* SECTION 1: INCOMING SHIPMENTS */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">
          INCOMING & SCHEDULED CONSIGNMENTS ({incomingShipments.length})
        </h3>

        {incomingShipments.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-slate-200 text-xs text-slate-600 font-bold">
            No active incoming shipments currently en route to {selectedFacility}.
          </div>
        ) : (
          incomingShipments.map((shipment) => {
            const isBreach = shipment.currentTemp !== null && (shipment.currentTemp < shipment.tempMin || shipment.currentTemp > shipment.tempMax);

            return (
              <div key={shipment.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
                {/* Header & Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-slate-600 block">{shipment.id}</span>
                    <h4 className="text-base font-black text-slate-900 mt-0.5">{shipment.medicine}</h4>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>

                {/* Sub-Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* ETA & Driver & Receiver Box */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-slate-700 uppercase block">LIVE ETA & SCHEDULE</span>
                      <div className="text-sm font-black text-[#006b3f] mt-1">
                        {shipment.status === 'in_transit' ? `Estimated Arrival: ${shipment.etaMinutes || 15} mins` : `Scheduled: ${shipment.scheduledDate || 'Today'} ${shipment.scheduledTime ? 'at ' + shipment.scheduledTime : ''}`}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 text-xs space-y-1 font-bold text-slate-800">
                      <div className="flex items-center">
                        <Truck className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                        <span>Driver: {shipment.driverName || shipment.driver} ({shipment.driverVehicle || 'Cold Unit'})</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-[#006b3f]" />
                        <span>Assigned Receiver: <strong>{shipment.receiverName || 'Pharmacy Officer'}</strong></span>
                      </div>
                      <div className="flex items-center font-mono text-emerald-800">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                        <a href={`tel:${shipment.receiverPhone || '0702896052'}`} className="hover:underline font-bold">
                          {shipment.receiverPhone || "0702896052"}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Temperature Display Box */}
                  <div className={`p-4 rounded-lg border flex items-center justify-between ${
                    isBreach ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50 border-emerald-300'
                  }`}>
                    <div>
                      <span className="text-xs font-extrabold text-slate-700 uppercase block">LIVE SENSOR</span>
                      <span className={`font-mono text-2xl font-black mt-1 block ${isBreach ? 'text-rose-600' : 'text-[#006b3f]'}`}>
                        {shipment.currentTemp !== null ? `${Number(shipment.currentTemp).toFixed(1)} °C` : '--.- °C'}
                      </span>
                      <span className="text-xs text-slate-600 font-bold block mt-0.5">
                        Safe Range: {shipment.tempMin}°C to {shipment.tempMax}°C
                      </span>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded uppercase ${isBreach ? 'bg-rose-600 text-white' : 'bg-emerald-200 text-[#006b3f]'}`}>
                      {isBreach ? 'BREACH' : 'IN RANGE'}
                    </span>
                  </div>
                </div>

                {/* Handover Code & Actions */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 text-xs font-bold text-slate-800">
                  <div className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-[#006b3f]" />
                    <span>Required Handover Pin: <strong className="font-mono text-slate-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 ml-1">{shipment.confirmationCode}</strong></span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onOpenReportIssueModal(shipment)}
                      className="px-4 py-2 rounded-lg border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 font-extrabold"
                    >
                      Report Issue
                    </button>
                    <button
                      onClick={() => onOpenConfirmReceiptModal(shipment)}
                      className="px-5 py-2 rounded-lg bg-[#006b3f] hover:bg-[#005230] text-white font-extrabold"
                    >
                      Confirm Receipt
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SECTION 2: RECEIVED HISTORY */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-[#006b3f]" />
            RECEIPT & AUDIT HISTORY
          </h3>
          <span className="text-xs font-extrabold text-slate-700 font-mono">
            {receivedShipments.length} Record(s)
          </span>
        </div>

        {receivedShipments.length === 0 ? (
          <p className="text-xs text-slate-600 font-semibold italic py-2">No historical deliveries logged for this facility.</p>
        ) : (
          <div className="space-y-2.5">
            {receivedShipments.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-300 text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900">{s.medicine}</h4>
                  <p className="text-xs text-slate-700 font-mono mt-0.5">
                    {s.id} &bull; Received by <strong>{s.recipientName || s.receiverName || 'Officer'}</strong>
                  </p>
                </div>
                <StatusBadge status={s.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
