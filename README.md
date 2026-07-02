# 📦 PayTrace

**Enterprise Supply Chain Custody, Receivables, and Payments Infrastructure.**  
Built for the **Nomba Hackathon 2024**.

---

## 🌟 Overview

**PayTrace** is a **supply chain accountability platform** built on **Nomba's payment infrastructure**. It gives manufacturers a verifiable, regulated-ledger record of who is physically and financially accountable for every batch of goods at every point in the distribution chain — from factory to distributor to retailer to shelf. 

Every custody handover produces a **real Nomba transaction**, either a matched commercial payment (cash sales) or a BVN-verified attestation (credit sales), making the chain **independently auditable and unforgeable**. 

Consumers can scan any product's QR code to see its full verified custody history and earn an instant reward for checking — turning the end buyer into a **real-time counterfeit detection network**.

## 🚀 Key Features

### 🏢 Manufacturer Portal (Web)
- **Live Receivables Aging Ledger:** Track total outstanding balances, 30/60/90-day overdue accounts, and instantly view the financial health of the supply chain.
- **Batch Custody Tree:** A visual, branching graph that tracks the exact location and custody state of every product batch from the origin node down to the final retailer.
- **Automated Approvals:** Integrate with Nomba webhooks to automatically release inventory batches the moment a distributor's payment clears.
- **Enterprise Settings & Webhooks:** Manage API keys, team access, and reward budgets.

### 📱 Field App (Mobile PWA)
- **Distributor & Retailer Workspaces:** A mobile-first interface designed for warehouse floors and retail shops.
- **One-Tap Custody Handoff:** Scan and accept inventory batches. The app instantly verifies Nomba payment status before allowing custody transfer.
- **My Inventory Pool:** Real-time visibility into available stock ready to be forwarded.
- **Settle Outstanding (Powered by Nomba):** Instantly settle credit or cash balances directly from the field using Nomba's payment rails, clearing flags on the Manufacturer's ledger instantly.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS v4, Material Symbols (Enterprise UI Design System)
- **Backend/API:** Node.js, Express (stubbed for Nomba integrations)
- **Payments Infrastructure:** **Nomba API** (Webhooks, Invoicing, and B2B Transfers)

---

## 💳 Nomba Hackathon Integration Details

PayTrace utilizes Nomba to power the financial logistics of the supply chain:
1. **Automated B2B Settlement:** When a Distributor allocates a batch to a Retailer, a Nomba invoice/payment link is dynamically generated. 
2. **Webhook Listeners:** The PayTrace backend listens for `payment.verified` webhooks from Nomba. Only when Nomba verifies the funds does the smart ledger update to "Custody Confirmed".
3. **Receivables Aging:** Outstanding debt in the supply chain is tracked against Nomba transaction histories, alerting Manufacturers to high-risk distributors.

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/paytrace.git
   cd paytrace
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the Portals:**
   - Manufacturer Web Portal: `http://localhost:3000/manufacturer/login`
   - Field App (Distributor): `http://localhost:3000/distributor/inventory` (Best viewed in mobile dimensions)

---

## 🎨 Design System

PayTrace features a bespoke enterprise design system built with custom Tailwind CSS v4 tokens, incorporating:
- Glassmorphism and Bento-box layouts for high data density.
- strict typography utilizing `Inter` and `JetBrains Mono` for ledger data.
- "Role-based responsive design" (Sidebars for desktop managers, Bottom-navs for mobile field workers).

---

## 👥 The Team

*Built with ❤️ for the Nomba Hackathon.*
