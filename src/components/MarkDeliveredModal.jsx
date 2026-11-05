import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, KeyRound, User, FileText } from 'lucide-react';

export default function MarkDeliveredModal({ shipment, isOpen, onClose, onConfirm }) {
  const [codeInput, setCodeInput] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !shipment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!codeInput.trim()) {
      setErrorMsg('Please enter the delivery confirmation code.');
      return;
    }

    if (codeInput.trim() !== shipment.confirmationCode) {
      setErrorMsg(`Invalid confirmation code! Expected: ${shipment.confirmationCode}`);
      return;
    }

    if (!recipientName.trim()) {
      setErrorMsg('Please enter the recipient full name.');
      return;
    }

    onConfirm(shipment.id, {
      confirmationCode: codeInput.trim(),
      recipientName: recipientName.trim(),
      notes: notes.trim(),
      deliveredAt: new Date().toISOString()
    });

    setCodeInput('');
    setRecipientName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        {/* Modal Header */}
        <div className="bg-[#006b3f] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-base">Handover & Delivery Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-slate-700">
            <p className="font-bold text-emerald-900 text-sm">{shipment.medicine}</p>
            <p className="text-slate-600 mt-0.5">Facility: <strong>{shipment.facility}</strong></p>
            <p className="text-slate-500 font-mono text-[11px] mt-0.5">ID: {shipment.id}</p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Confirmation Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
              <KeyRound className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
              Handover Confirmation Pin <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder={`Enter code (Demo: ${shipment.confirmationCode})`}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#006b3f] font-mono tracking-wider"
              autoFocus
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
              Recipient Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Dr. Sarah Maina / Pharmacist On Duty"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#006b3f]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-[#006b3f]" />
              Inspection Remarks / Handover Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Consignment received in good order..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#006b3f]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-[#006b3f] text-white hover:bg-[#005230] shadow-sm transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Delivery</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
