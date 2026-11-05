import React from 'react';
import { X, MessageSquare, ExternalLink, CheckCircle2, Send } from 'lucide-react';

export default function NotificationModal({ shipment, isOpen, onClose }) {
  if (!isOpen || !shipment) return null;

  const receiverName = shipment.receiverName || "Receiver Officer";
  const rawPhone = shipment.receiverPhone || "0702896052";
  const facility = shipment.facility || "Hospital";
  const medicine = shipment.medicine || "Vaccine Payload";
  const driverName = shipment.driverName || shipment.driver || "Driver";

  // Format phone number for WhatsApp wa.me link
  const formatPhone = (phoneStr) => {
    const clean = phoneStr.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      return '254' + clean.slice(1);
    }
    if (clean.startsWith('254')) {
      return clean;
    }
    return '254' + clean;
  };

  const formattedPhone = formatPhone(rawPhone);
  const messageText = `Hello ${receiverName}, your medical delivery of ${medicine} from Posta is on the way. Driver: ${driverName}.`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-[#006b3f] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base">Consignment Dispatch Alert</h3>
              <p className="text-xs text-emerald-100">Simulated SMS & WhatsApp Gateway</p>
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
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-slate-700 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#006b3f]" />
              <span>Notification Sent Successfully</span>
            </div>
            <p className="text-slate-600 mt-1">
              Notification sent to <strong>{receiverName}</strong> ({rawPhone}) at <strong>{facility}</strong> via SMS/WhatsApp.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PRE-FILLED WHATSAPP MESSAGE</span>
            <p className="text-slate-800 font-mono text-xs bg-white p-2.5 rounded border border-slate-200 leading-relaxed italic">
              "{messageText}"
            </p>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="pt-2 flex flex-col space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1eae53] text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Open WhatsApp ({formattedPhone})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs"
            >
              Close Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
