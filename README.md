# Post4Health Cold-Chain Tracker - Posta Kenya Medical Delivery Project

A modern, responsive web app built for **Posta Kenya's Post4Health medical delivery project**. It tracks temperature-sensitive medical shipments (vaccines, insulin, blood plasma, maternal health injections) across health facilities in Kenya using real-time temperature telemetry simulation, automated breach detection, role-based workflows, and cold-chain compliance CSV export.

---

## 🚀 Quick Start Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or newer)
- `npm` (v8.x or newer)

### Step-by-Step Setup

1. **Clone or Open Project Directory**
   ```bash
   cd Post4Health
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000` (or the URL output by Vite in your terminal).

5. **Build for Production** (Optional)
   ```bash
   npm run build
   ```

---

## 🌟 Key Features & Role-Based Views

The app features a top **Role Selector** allowing seamless switching between 3 operational roles:

### 1. 🚚 Driver View (Mobile-Optimized)
Designed for Posta Kenya delivery drivers on mobile devices:
- **Assigned Deliveries List**: Displays assigned medical shipments with target facility name, delivery address, payload medicine type, required temperature range (e.g. `2–8°C`), and pin code.
- **Start Trip Button**: Transitions shipment status from `pending` to `in_transit` and activates live temperature telemetry.
- **Live Temperature Readout**: Automatically updates every 5 seconds with simulated sensor readings.
- **Red Alert Banner**: Prominently flashes when current temperature drifts out of safe limits.
- **Mark Delivered Modal**: Opens verification form requiring entry of confirmation code, recipient name, and inspection notes.
- **Trip History List**: Displays completed and historical deliveries.

### 2. 🏥 Facility View (Hospital Intake)
Designed for healthcare facility receiving staff (pharmacists & lab managers):
- **Facility Selector**: Allows staff to pick their healthcare facility (*Kenyatta National Hospital*, *Coast General Teaching & Referral Hospital*, or *Kisumu County Referral Hospital*).
- **Incoming Shipments**: Displays incoming medical packages, ETA, driver details, and current temperature status.
- **Confirm Receipt**: Allows receiving officers to input confirmation code and recipient name to confirm delivery.
- **Report Issue Modal**: Allows staff to flag issues with a required category dropdown (*Temperature breach*, *Damaged packaging*, *Wrong item*, *Short quantity*) plus detailed observational notes.
- **Received & Issue History**: Tracks all historical receipts and reported incidents.

### 3. 📊 Admin Dashboard (Central Command)
Designed for Posta logistics managers and regulatory auditors:
- **4 Real-time Summary Cards**:
  - Total Deliveries Today
  - In Transit
  - Delivered
  - Temperature Breaches
- **Cold-Chain Compliance Audit Matrix**: Computes min/max temperatures recorded, compliance percentage rate (time/readings in range), and breach count per shipment.
- **Interactive Shipments Table**: Search by ID/facility/driver/medicine, filter by status (`In Transit`, `Pending`, `Delivered`, `Issue`).
- **CSV Compliance Export**: One-click download of the complete compliance report and shipment logs formatted for Excel/CSV audit tools.
- **Dispatch New Shipment**: Create and assign new medical shipments to drivers and facilities.

---

## 💾 LocalStorage Data Models

All data persists in `localStorage` without requiring a backend for the MVP:

1. **`shipments`**:
   `{ id, facility, address, medicine, tempMin, tempMax, driver, status, createdAt, deliveredAt, confirmationCode, recipientName, notes, currentTemp, eta }`

2. **`tempLogs`**:
   `{ shipmentId, timestamp, temperature }`

3. **`issues`**:
   `{ shipmentId, type, notes, timestamp, facility }`

---

## 🎨 Technology Stack & Branding
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Iconography**: Lucide React
- **Brand Palette**: Posta Kenya Emerald Green (`#15803d` / `#004d25`) & Gold Accents (`#eab308`)
