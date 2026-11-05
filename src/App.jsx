import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DriverView from './components/DriverView';
import FacilityView from './components/FacilityView';
import AdminDashboard from './components/AdminDashboard';
import MarkDeliveredModal from './components/MarkDeliveredModal';
import ReportIssueModal from './components/ReportIssueModal';
import NewShipmentModal from './components/NewShipmentModal';
import ComplianceReportModal from './components/ComplianceReportModal';
import NotificationModal from './components/NotificationModal';
import SplashScreen from './components/SplashScreen';
import { storageService } from './services/storageService';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storageService.init();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const [activeRole, setActiveRole] = useState('ADMIN');
  const [shipments, setShipments] = useState(() => storageService.getShipments());
  const [facilities, setFacilities] = useState(() => storageService.getFacilities());
  const [drivers, setDrivers] = useState(() => storageService.getDrivers());

  const [selectedShipmentForModal, setSelectedShipmentForModal] = useState(null);
  const [notificationShipment, setNotificationShipment] = useState(null);
  const [isMarkDeliveredOpen, setIsMarkDeliveredOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    if (window.AndroidNative && window.AndroidNative.showToast) {
      window.AndroidNative.showToast(message);
    }
    setTimeout(() => setToast(null), 4000);
  };

  const reloadData = () => {
    setShipments(storageService.getShipments());
    setFacilities(storageService.getFacilities());
    setDrivers(storageService.getDrivers());
  };

  // Live Temperature Simulation Ticker (5 seconds interval)
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      const currentList = storageService.getShipments();
      const inTransitList = currentList.filter(s => s.status === 'in_transit');

      if (inTransitList.length > 0) {
        inTransitList.forEach(shipment => {
          const isAnomaly = Math.random() < 0.12;
          let newTemp;

          if (isAnomaly) {
            const goHigh = Math.random() > 0.5;
            newTemp = goHigh
              ? shipment.tempMax + Number((Math.random() * 2.0 + 0.4).toFixed(1))
              : shipment.tempMin - Number((Math.random() * 1.5 + 0.4).toFixed(1));
          } else {
            const mid = (shipment.tempMin + shipment.tempMax) / 2;
            const delta = (Math.random() - 0.5) * 1.6;
            newTemp = Number((mid + delta).toFixed(1));
            if (newTemp < shipment.tempMin) newTemp = shipment.tempMin + 0.2;
            if (newTemp > shipment.tempMax) newTemp = shipment.tempMax - 0.2;
          }

          if ((newTemp < shipment.tempMin || newTemp > shipment.tempMax) && window.AndroidNative && window.AndroidNative.triggerVibration) {
            window.AndroidNative.triggerVibration();
          }

          storageService.updateShipmentTemp(shipment.id, newTemp);
          storageService.addTempLog({
            shipmentId: shipment.id,
            timestamp: new Date().toISOString(),
            temperature: newTemp
          });
        });

        setShipments(storageService.getShipments());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Live ETA Countdown Timer (Decrements etaMinutes every 10 seconds for demo)
  useEffect(() => {
    if (isLoading) return;

    const etaInterval = setInterval(() => {
      const updatedList = storageService.decrementEtaMinutes();
      setShipments(updatedList);
    }, 10000);

    return () => clearInterval(etaInterval);
  }, [isLoading]);

  // Handlers
  const handleStartTrip = (shipmentId) => {
    const target = shipments.find(s => s.id === shipmentId);
    const updated = storageService.updateShipmentStatus(shipmentId, 'in_transit', {
      currentTemp: 4.2,
      etaMinutes: 15
    });

    setShipments(updated);
    setNotificationShipment(target);
    setIsNotificationModalOpen(true);

    const receiver = target?.receiverName || 'Receiver';
    const facility = target?.facility || 'Hospital';
    showToast(`Notification sent to ${receiver} at ${facility} via SMS/WhatsApp.`, 'info');
  };

  const handleConfirmDelivery = (shipmentId, deliveryData) => {
    const updated = storageService.updateShipmentStatus(shipmentId, 'delivered', {
      deliveredAt: deliveryData.deliveredAt,
      recipientName: deliveryData.recipientName,
      notes: deliveryData.notes,
      etaMinutes: 0
    });
    setShipments(updated);
    showToast(`Receipt Confirmed & Signed. Driver & Admin notified.`, 'success');
  };

  const handleSubmitIssue = (issueData) => {
    storageService.addIssue(issueData);
    reloadData();
    showToast(`Issue reported for ${issueData.shipmentId}. Admin notified.`, 'warning');
  };

  const handleCreateShipment = (newShipment) => {
    const updated = storageService.addShipment(newShipment);
    setShipments(updated);
    showToast(`Scheduled delivery ${newShipment.id} created! Receiver & driver assigned.`, 'success');
  };

  const handleResetSeed = () => {
    storageService.resetToSeed();
    reloadData();
    showToast('Reset data to initial state.', 'info');
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  const unreadNotifsCount = storageService.getNotifications().length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Header & Role Selector */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onResetSeed={handleResetSeed}
        notificationCount={unreadNotifsCount}
      />

      {/* Main Role Content */}
      <main className="flex-1 pb-16">
        {activeRole === 'DRIVER' && (
          <DriverView
            shipments={shipments}
            onStartTrip={handleStartTrip}
            onOpenMarkDeliveredModal={(shipment) => {
              setSelectedShipmentForModal(shipment);
              setIsMarkDeliveredOpen(true);
            }}
          />
        )}

        {activeRole === 'FACILITY' && (
          <FacilityView
            facilities={facilities}
            shipments={shipments}
            onOpenConfirmReceiptModal={(shipment) => {
              setSelectedShipmentForModal(shipment);
              setIsMarkDeliveredOpen(true);
            }}
            onOpenReportIssueModal={(shipment) => {
              setSelectedShipmentForModal(shipment);
              setIsReportIssueOpen(true);
            }}
          />
        )}

        {activeRole === 'ADMIN' && (
          <AdminDashboard
            shipments={shipments}
            onOpenNewShipmentModal={() => setIsNewShipmentOpen(true)}
            onOpenComplianceModal={(shipment) => {
              setSelectedShipmentForModal(shipment);
              setIsComplianceModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <MarkDeliveredModal
        shipment={selectedShipmentForModal}
        isOpen={isMarkDeliveredOpen}
        onClose={() => setIsMarkDeliveredOpen(false)}
        onConfirm={handleConfirmDelivery}
      />

      <ReportIssueModal
        shipment={selectedShipmentForModal}
        isOpen={isReportIssueOpen}
        onClose={() => setIsReportIssueOpen(false)}
        onSubmitIssue={handleSubmitIssue}
      />

      <NewShipmentModal
        isOpen={isNewShipmentOpen}
        onClose={() => setIsNewShipmentOpen(false)}
        onCreateShipment={handleCreateShipment}
        facilities={facilities}
        drivers={drivers}
      />

      <ComplianceReportModal
        shipment={selectedShipmentForModal}
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
      />

      <NotificationModal
        shipment={notificationShipment}
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 transform transition-all">
          <div className={`px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 text-xs font-extrabold ${
            toast.type === 'warning'
              ? 'bg-rose-600 text-white'
              : 'bg-[#006b3f] text-white'
          }`}>
            {toast.type === 'warning' ? (
              <ShieldAlert className="w-4 h-4 text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
