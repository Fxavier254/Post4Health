import React, { useState } from 'react';
import { X, Plus, Package, MapPin, Truck, Thermometer, Calendar, Clock, User, Phone, ShieldCheck } from 'lucide-react';

export default function NewShipmentModal({ isOpen, onClose, onCreateShipment, facilities, drivers }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toTimeString().slice(0, 5);

  const defaultFacility = facilities[0] || { name: 'Aga Khan University Hospital', location: '3rd Parklands Avenue, Nairobi', contactPerson: 'Admin Test', phone: '0702896052' };
  const defaultDriver = drivers[0] || { name: 'Peter Mwangi', phone: '+254 701 112 233', vehicle: 'KCF 482L (Cold Van)' };

  const [facilityName, setFacilityName] = useState(defaultFacility.name);
  const [address, setAddress] = useState(defaultFacility.location);
  const [medicine, setMedicine] = useState('AstraZeneca COVID-19 Vaccine (2-8°C)');
  const [tempMin, setTempMin] = useState(2);
  const [tempMax, setTempMax] = useState(8);

  const [receiverName, setReceiverName] = useState(defaultFacility.contactPerson || 'Pharmacy Officer');
  const [receiverPhone, setReceiverPhone] = useState(defaultFacility.phone || '0702896052');

  const [driverName, setDriverName] = useState(defaultDriver.name);
  const [driverPhone, setDriverPhone] = useState(defaultDriver.phone);
  const [driverVehicle, setDriverVehicle] = useState(defaultDriver.vehicle);

  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [scheduledTime, setScheduledTime] = useState(timeStr);

  const [confirmationCode] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [notes, setNotes] = useState('Priority cold chain consignment dispatch.');

  if (!isOpen) return null;

  const handleFacilityChange = (name) => {
    setFacilityName(name);
    const selected = facilities.find(f => f.name === name);
    if (selected) {
      setAddress(selected.location);
      if (selected.contactPerson) setReceiverName(selected.contactPerson);
      if (selected.phone) setReceiverPhone(selected.phone);
    }
  };

  const handleDriverChange = (name) => {
    setDriverName(name);
    const selected = drivers.find(d => d.name === name);
    if (selected) {
      setDriverPhone(selected.phone);
      setDriverVehicle(selected.vehicle);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newId = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newShipment = {
      id: newId,
      facility: facilityName,
      address,
      medicine,
      tempMin: Number(tempMin),
      tempMax: Number(tempMax),
      driver: driverName,
      driverName,
      driverPhone,
      driverVehicle,
      receiverName,
      receiverPhone,
      scheduledDate,
      scheduledTime,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      deliveredAt: null,
      confirmationCode: confirmationCode || '5555',
      recipientName: null,
      notes,
      currentTemp: (Number(tempMin) + Number(tempMax)) / 2,
      etaMinutes: 25
    };

    onCreateShipment(newShipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-[#006b3f] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-base">Schedule New Medical Delivery</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition font-black text-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Facility & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
                Hospital / Facility Name <span className="text-rose-500">*</span>
              </label>
              <select
                value={facilityName}
                onChange={(e) => handleFacilityChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f] bg-white"
              >
                {facilities.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} ({f.county})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Facility Address / Pharmacy Store
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006b3f]"
                required
              />
            </div>
          </div>

          {/* Receiver Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
                Receiver Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="e.g. Dr. Sarah Maina"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f] bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
                Receiver Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="e.g. 0702896052"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f] bg-white"
                required
              />
            </div>
          </div>

          {/* Medicine Payload */}
          <div>
            <label className="block font-bold text-slate-900 mb-1 flex items-center">
              <Package className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
              Medicine / Vaccine Payload <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              placeholder="e.g. Pfizer COVID-19 Vaccine / Insulin / Blood Plasma"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f]"
              required
            />
          </div>

          {/* Temp Range */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <Thermometer className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                Min Temp (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f] bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <Thermometer className="w-3.5 h-3.5 mr-1 text-rose-700" />
                Max Temp (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f] bg-white"
                required
              />
            </div>
          </div>

          {/* Driver Selection & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
                Assigned Driver
              </label>
              <select
                value={driverName}
                onChange={(e) => handleDriverChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f] bg-white"
              >
                {drivers.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.vehicle})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
                Driver Phone Number
              </label>
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f]"
                required
              />
            </div>
          </div>

          {/* Scheduled Date & Time */}
          <div className="grid grid-cols-2 gap-3 bg-blue-50/60 p-3 rounded-lg border border-blue-200">
            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-blue-700" />
                Scheduled Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f] bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-blue-700" />
                Scheduled Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006b3f] bg-white"
                required
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block font-bold text-slate-900 mb-1">
              Dispatch Instructions / Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006b3f]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-xs font-extrabold text-slate-700 border border-slate-300 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-xs font-extrabold bg-[#006b3f] text-white hover:bg-[#005230] shadow-sm transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Delivery</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
