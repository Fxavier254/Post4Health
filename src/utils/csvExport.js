// CSV Export Utility for Post4Health Compliance Reports

import { storageService } from '../services/storageService';

export function exportComplianceReportCSV(shipments) {
  const allLogs = storageService.getTempLogs();
  const allIssues = storageService.getIssues();

  // CSV Headers
  const headers = [
    "Shipment ID",
    "Facility Name",
    "Medicine Type",
    "Driver",
    "Status",
    "Required Min Temp (°C)",
    "Required Max Temp (°C)",
    "Recorded Min Temp (°C)",
    "Recorded Max Temp (°C)",
    "Total Readings",
    "Total Breaches",
    "Compliance Rate (%)",
    "Confirmation Code",
    "Recipient Name",
    "Reported Issues",
    "Created Date",
    "Delivered Date"
  ];

  const rows = shipments.map(s => {
    const logs = allLogs.filter(l => l.shipmentId === s.id);
    const shipmentIssues = allIssues.filter(i => i.shipmentId === s.id);

    let minTemp = "N/A";
    let maxTemp = "N/A";
    let breaches = 0;
    let complianceRate = "100.0";

    if (logs.length > 0) {
      const temps = logs.map(l => l.temperature);
      minTemp = Math.min(...temps).toFixed(1);
      maxTemp = Math.max(...temps).toFixed(1);

      const breachCount = logs.filter(l => l.temperature < s.tempMin || l.temperature > s.tempMax).length;
      breaches = breachCount;
      complianceRate = (((logs.length - breachCount) / logs.length) * 100).toFixed(1);
    }

    const issueText = shipmentIssues.map(i => `${i.type}: ${i.notes}`).join(" | ") || "None";
    const formattedCreated = s.createdAt ? new Date(s.createdAt).toLocaleString() : "";
    const formattedDelivered = s.deliveredAt ? new Date(s.deliveredAt).toLocaleString() : "Not Delivered";

    return [
      `"${s.id}"`,
      `"${s.facility.replace(/"/g, '""')}"`,
      `"${s.medicine.replace(/"/g, '""')}"`,
      `"${s.driver.replace(/"/g, '""')}"`,
      `"${s.status.toUpperCase()}"`,
      s.tempMin,
      s.tempMax,
      minTemp,
      maxTemp,
      logs.length,
      breaches,
      `"${complianceRate}%"`,
      `"${s.confirmationCode}"`,
      `"${(s.recipientName || 'N/A').replace(/"/g, '""')}"`,
      `"${issueText.replace(/"/g, '""')}"`,
      `"${formattedCreated}"`,
      `"${formattedDelivered}"`
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute("download", `Post4Health_ColdChain_Compliance_Report_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
