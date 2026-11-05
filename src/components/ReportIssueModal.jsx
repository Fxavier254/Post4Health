import React, { useState } from 'react';
import { X, AlertTriangle, FileText, Send, ShieldAlert } from 'lucide-react';

export default function ReportIssueModal({ shipment, isOpen, onClose, onSubmitIssue }) {
  const [issueType, setIssueType] = useState('temperature breach');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !shipment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setErrorMsg('Please provide observational details explaining the issue.');
      return;
    }

    onSubmitIssue({
      shipmentId: shipment.id,
      type: issueType,
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
      facility: shipment.facility
    });

    setNotes('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-rose-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Flag Consignment Issue</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-slate-700">
            <p className="font-bold text-rose-900 text-sm">{shipment.medicine}</p>
            <p className="text-slate-600 mt-0.5">ID: <span className="font-mono">{shipment.id}</span> &bull; {shipment.facility}</p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-lg p-3 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Issue Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="temperature breach">Temperature Breach</option>
              <option value="damaged packaging">Damaged Packaging / Seal Tampered</option>
              <option value="wrong item">Incorrect Consignment Delivered</option>
              <option value="short quantity">Short Quantity / Missing Vials</option>
            </select>
          </div>

          {/* Issue Details Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-slate-600" />
              Observational Notes & Findings <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Describe findings (e.g., Temp reading 9.4°C exceeding safe 8°C limit, outer box torn...)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Issue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
