// LocalStorage persistence service for Post4Health Cold-Chain Tracker

import {
  INITIAL_SHIPMENTS,
  INITIAL_TEMP_LOGS,
  INITIAL_ISSUES,
  INITIAL_FACILITIES,
  INITIAL_DRIVERS,
  INITIAL_NOTIFICATIONS
} from '../constants/initialData';

const KEYS = {
  VERSION: 'post4health_seed_v7_admin_scheduling',
  SHIPMENTS: 'post4health_shipments',
  TEMP_LOGS: 'post4health_temp_logs',
  ISSUES: 'post4health_issues',
  FACILITIES: 'post4health_facilities',
  DRIVERS: 'post4health_drivers',
  NOTIFICATIONS: 'post4health_notifications'
};

export const storageService = {
  // Initialize seed data if not present or if version upgraded
  init() {
    if (localStorage.getItem(KEYS.VERSION) !== 'post4health_seed_v7_admin_scheduling') {
      this.resetToSeed();
    }
  },

  // Reset to original seed data
  resetToSeed() {
    localStorage.setItem(KEYS.VERSION, 'post4health_seed_v7_admin_scheduling');
    localStorage.setItem(KEYS.SHIPMENTS, JSON.stringify(INITIAL_SHIPMENTS));
    localStorage.setItem(KEYS.TEMP_LOGS, JSON.stringify(INITIAL_TEMP_LOGS));
    localStorage.setItem(KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(INITIAL_FACILITIES));
    localStorage.setItem(KEYS.DRIVERS, JSON.stringify(INITIAL_DRIVERS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  },

  // Shipments API
  getShipments() {
    try {
      const data = localStorage.getItem(KEYS.SHIPMENTS);
      return data ? JSON.parse(data) : INITIAL_SHIPMENTS;
    } catch (e) {
      console.error("Error reading shipments", e);
      return INITIAL_SHIPMENTS;
    }
  },

  saveShipments(shipments) {
    localStorage.setItem(KEYS.SHIPMENTS, JSON.stringify(shipments));
  },

  getShipmentById(id) {
    const list = this.getShipments();
    return list.find(s => s.id === id);
  },

  addShipment(newShipment) {
    const list = this.getShipments();
    const updated = [newShipment, ...list];
    this.saveShipments(updated);

    this.addTempLog({
      shipmentId: newShipment.id,
      timestamp: new Date().toISOString(),
      temperature: newShipment.currentTemp || 4.5
    });

    this.addNotification({
      id: `NOT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `New consignment ${newShipment.id} scheduled for ${newShipment.facility}. Assigned to driver ${newShipment.driverName || newShipment.driver} & receiver ${newShipment.receiverName || 'Pharmacy Officer'}.`,
      type: 'shipment_created',
      hospital: newShipment.facility
    });

    return updated;
  },

  updateShipmentStatus(id, newStatus, extraData = {}) {
    const list = this.getShipments();
    let targetShipment = null;
    const updated = list.map(item => {
      if (item.id === id) {
        targetShipment = { ...item, status: newStatus, ...extraData };
        return targetShipment;
      }
      return item;
    });

    this.saveShipments(updated);

    if (targetShipment) {
      if (newStatus === 'in_transit') {
        this.addNotification({
          id: `NOT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: `Dispatch started for ${targetShipment.facility} (${targetShipment.medicine}). Driver ${targetShipment.driverName || targetShipment.driver} is en route. Receiver ${targetShipment.receiverName || 'Pharmacy Officer'} (${targetShipment.receiverPhone || ''}) notified.`,
          type: 'trip_started',
          hospital: targetShipment.facility
        });
      } else if (newStatus === 'delivered') {
        this.addNotification({
          id: `NOT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: `${targetShipment.facility} confirmed receipt & signed for ${targetShipment.medicine}. Driver ${targetShipment.driverName || targetShipment.driver} notified.`,
          type: 'delivery_confirmed',
          hospital: targetShipment.facility
        });
      }
    }

    return updated;
  },

  updateShipmentTemp(id, newTemp) {
    const list = this.getShipments();
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          currentTemp: newTemp
        };
      }
      return item;
    });
    this.saveShipments(updated);
    return updated;
  },

  decrementEtaMinutes() {
    const list = this.getShipments();
    let changed = false;
    const updated = list.map(item => {
      if (item.status === 'in_transit' && item.etaMinutes > 0) {
        changed = true;
        const newEta = item.etaMinutes - 1;
        return {
          ...item,
          etaMinutes: newEta,
          eta: newEta === 0 ? 'ARRIVING NOW' : `~${newEta} min`
        };
      }
      return item;
    });
    if (changed) {
      this.saveShipments(updated);
    }
    return updated;
  },

  // Notifications API
  getNotifications() {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  },

  addNotification(notif) {
    const list = this.getNotifications();
    const updated = [notif, ...list];
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  // Temp Logs API
  getTempLogs(shipmentId = null) {
    try {
      const data = localStorage.getItem(KEYS.TEMP_LOGS);
      const logs = data ? JSON.parse(data) : INITIAL_TEMP_LOGS;
      if (shipmentId) {
        return logs.filter(l => l.shipmentId === shipmentId);
      }
      return logs;
    } catch (e) {
      return INITIAL_TEMP_LOGS;
    }
  },

  addTempLog(logEntry) {
    const logs = this.getTempLogs();
    const updated = [...logs, logEntry];
    localStorage.setItem(KEYS.TEMP_LOGS, JSON.stringify(logs));
    return updated;
  },

  // Issues API
  getIssues(shipmentId = null) {
    try {
      const data = localStorage.getItem(KEYS.ISSUES);
      const issues = data ? JSON.parse(data) : INITIAL_ISSUES;
      if (shipmentId) {
        return issues.filter(i => i.shipmentId === shipmentId);
      }
      return issues;
    } catch (e) {
      return INITIAL_ISSUES;
    }
  },

  addIssue(issueEntry) {
    const issues = this.getIssues();
    const updated = [issueEntry, ...issues];
    localStorage.setItem(KEYS.ISSUES, JSON.stringify(issues));

    this.updateShipmentStatus(issueEntry.shipmentId, 'issue', {
      notes: issueEntry.notes
    });

    this.addNotification({
      id: `NOT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `ALERT: Issue reported for ${issueEntry.shipmentId} at ${issueEntry.facility} (${issueEntry.type}).`,
      type: 'issue_reported',
      hospital: issueEntry.facility
    });

    return updated;
  },

  // Facilities & Drivers
  getFacilities() {
    try {
      const data = localStorage.getItem(KEYS.FACILITIES);
      return data ? JSON.parse(data) : INITIAL_FACILITIES;
    } catch (e) {
      return INITIAL_FACILITIES;
    }
  },

  getDrivers() {
    try {
      const data = localStorage.getItem(KEYS.DRIVERS);
      return data ? JSON.parse(data) : INITIAL_DRIVERS;
    } catch (e) {
      return INITIAL_DRIVERS;
    }
  }
};
