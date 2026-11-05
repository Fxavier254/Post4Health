import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, AlertTriangle, Calendar, Download, Plus, Search, Filter, Bell, MessageSquare, ShieldCheck, User } from 'lucide-react';
import { exportComplianceReportCSV } from '../utils/csvExport';
import { storageService } from '../services/storageService';
import StatusBadge from './StatusBadge';

export default function AdminDashboard({
  shipments,
  onOpenNewShipmentModal,
  onOpenComplianceModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const notifications = storageService.getNotifications();
  const totalDeliveriesToday = shipments.length;
  const inTransitCount = shipments.filter(s => s.status === 'in_transit').length;
  const scheduledCount = shipments.filter(s => s.status === 'scheduled' || s.status === 'pending').length;
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length;
  const breachesCount = shipments.filter(s => s.status === 'issue' || (s.currentTemp !== null && (s.currentTemp < s.tempMin || s.currentTemp > s.tempMax))).length;

  const filteredShipments = shipments.filter(s => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.driverName || s.driver || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.receiverName || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'SCHEDULED') return matchesSearch && (s.status === 'scheduled' || s.status === 'pending');
    if (statusFilter === 'IN_TRANSIT') return matchesSearch && s.status === 'in_transit';
    if (statusFilter === 'DELIVERED') return matchesSearch && s.status === 'delivered';
    if (statusFilter === 'ISSUE') return matchesSearch && s.status === 'issue';

    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-black text-[#006b3f] uppercase tracking-wider block">
            OPERATIONS COMMAND &bull; REGULATORY AUDIT
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Cold-Chain Operations & Delivery Scheduling
          </h2>
          <p className="text-xs font-semibold text-slate-700 mt-1 max-w-xl">
            Schedule consignments, assign drivers and receivers, monitor real-time cold-chain telemetry, and export audit compliance logs.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-center">
          <button
            onClick={onOpenNewShipmentModal}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#006b3f] hover:bg-[#005230] text-white text-xs font-extrabold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Delivery</span>
          </button>

          <button
            onClick={() => exportComplianceReportCSV(shipments)}
            title="Export CSV Audit Report"
            className="flex items-center space-x-1 px-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 text-xs font-extrabold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-[#006b3f]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Clinical Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              TOTAL CONSIGNMENTS
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalDeliveriesToday}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#006b3f] border border-emerald-300 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              SCHEDULED / PENDING
            </span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">
              {scheduledCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 border border-blue-300 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              IN TRANSIT
            </span>
            <span className="text-2xl font-black text-[#006b3f] mt-1 block">
              {inTransitCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#006b3f] border border-emerald-300 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              TEMP BREACHES
            </span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">
              {breachesCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ALL SHIPMENTS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, hospital, receiver, driver..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006b3f]"
              />
            </div>

            <div className="flex items-center space-x-1 text-xs font-bold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="ISSUE">Issue Flagged</option>
              </select>
            </div>
          </div>

          <button
            onClick={onOpenNewShipmentModal}
            className="px-4 py-2.5 rounded-lg bg-[#006b3f] hover:bg-[#005230] text-white font-extrabold text-xs shadow-sm transition flex items-center space-x-1.5 self-end sm:self-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Schedule Delivery</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-xs font-black text-slate-800 uppercase tracking-wider">
                <th className="py-3.5 px-4">Shipment ID</th>
                <th className="py-3.5 px-4">Destination & Payload</th>
                <th className="py-3.5 px-4">Assigned Receiver</th>
                <th className="py-3.5 px-4">Assigned Driver</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-600 font-bold text-xs italic">
                    No consignments found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s) => {
                  const isBreach = s.currentTemp !== null && (s.currentTemp < s.tempMin || s.currentTemp > s.tempMax);

                  return (
                    <tr
                      key={s.id}
                      onClick={() => onOpenComplianceModal(s)}
                      className="hover:bg-slate-100/80 transition cursor-pointer"
                    >
                      {/* Column 1: ID */}
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-800">
                        {s.id}
                      </td>

                      {/* Column 2: Facility & Medicine */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 text-sm">
                          {s.facility}
                        </div>
                        <div className="text-slate-700 font-semibold text-xs mt-0.5">
                          {s.medicine}
                        </div>
                      </td>

                      {/* Column 3: Receiver */}
                      <td className="py-3.5 px-4 text-slate-800 font-bold">
                        <div>{s.receiverName || 'Receiver'}</div>
                        <div className="text-xs text-emerald-800 font-mono font-bold mt-0.5">{s.receiverPhone || '0702896052'}</div>
                      </td>

                      {/* Column 4: Driver */}
                      <td className="py-3.5 px-4 text-slate-800 font-bold">
                        <div>{s.driverName || s.driver}</div>
                        <div className="text-[11px] text-slate-600 font-mono mt-0.5">{s.driverPhone || '+254701112233'}</div>
                      </td>

                      {/* Column 5: Scheduled Date/Time */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        <div>{s.scheduledDate || 'Today'}</div>
                        <div className="text-[11px] text-slate-600">{s.scheduledTime || '--:--'}</div>
                      </td>

                      {/* Column 6: Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={s.status} />
                      </td>

                      {/* Column 7: Temp */}
                      <td className="py-3.5 px-4 text-right">
                        {s.currentTemp === null ? (
                          <div className="font-mono text-slate-400 font-bold">–</div>
                        ) : (
                          <div className={`font-mono font-black text-sm ${isBreach ? 'text-rose-600' : 'text-[#006b3f]'}`}>
                            {Number(s.currentTemp).toFixed(1)}°C
                          </div>
                        )}
                        <div className="text-[11px] text-slate-600 font-bold mt-0.5">
                          {s.tempMin} to {s.tempMax}°C
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN NOTIFICATION AUDIT LOG PANEL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[#006b3f]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">
                Live Audit & Driver Notification Log
              </h3>
              <p className="text-xs font-semibold text-slate-700">
                Real-time dispatch alerts, WhatsApp/SMS gateway logs, and receipt signatures.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-mono border border-slate-200">
            {notifications.length} Event(s)
          </span>
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-600 italic">No notification events logged yet.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="p-3 rounded-lg bg-slate-50 border border-slate-300 text-xs flex items-start justify-between gap-3">
                <div className="flex items-start space-x-2.5">
                  <div className={`mt-0.5 p-1 rounded ${
                    notif.type === 'breach_alert' || notif.type === 'issue_reported'
                      ? 'bg-rose-100 text-rose-800'
                      : notif.type === 'delivery_confirmed'
                      ? 'bg-emerald-100 text-[#006b3f]'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {notif.type === 'delivery_confirmed' ? (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    ) : (
                      <MessageSquare className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block">{notif.hospital}</span>
                    <p className="text-slate-800 font-medium mt-0.5">{notif.message}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-600 font-bold whitespace-nowrap">
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
