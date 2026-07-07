# PayTrace 🛡️💳

**A Financial Accountability & Anti-Counterfeiting Layer built for the Nomba Hackathon.**

🌍 **Live Demo:** [Insert Deployed Link Here]

PayTrace solves the counterfeit crisis and broken supply chain accountability in Africa by physically linking the movement of physical goods to the movement of money. By leveraging the **Nomba API**, every handover of goods requires a verifiable financial transaction, creating an immutable chain of custody that consumers can trust.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React & TailwindCSS
- Custom Modern UI/UX (Glassmorphism, Micro-animations)

**Backend**
- Node.js & Express
- Prisma ORM
- PostgreSQL
- **Nomba API Integration**

---

## 🔌 Nomba APIs Integrated

We utilized the Nomba Sandbox APIs to create a closed-loop financial ecosystem:
1. **Authentication (`POST /v1/auth/token/issue`)**: Secure server-to-server OAuth client credential flows.
2. **Virtual Accounts (`POST /v1/accounts/virtual`)**: Every single Batch of goods created on PayTrace automatically provisions a unique Nomba Virtual Account. Distributors must pay into this specific account to unlock the goods.
3. **Bank Transfers (`POST /v1/transfers/bank`)**: Used for B2B Settlement simulation, and for B2C Micropayment Rewards when consumers verify genuine products.

---

## 🎬 How to Judge / Demo the Application

To understand the full power of PayTrace, please follow this step-by-step flow which takes a product from the Factory floor all the way to the end Consumer's hands.

### Act 1: The Manufacturer & Distributor
1. Navigate to the live application: **[Insert Deployed Link Here]**
2. Click the **"Simulate Login (Hackathon Demo)"** button. 
3. On the **Manufacturer Dashboard**, click **"Create New Batch"**. Enter a product name (e.g., *Premium Engine Oil*) and quantity. This creates the batch and provisions a **Nomba Virtual Account**.
5. Switch to the **Distributor Dashboard** using the sidebar.
6. You will see the new pending batch. Click **"Receive Goods"**.
7. Click the **"Simulate Bank Transfer (Nomba API)"** button. This executes a real API call to the Nomba sandbox, paying the Virtual Account to legally transfer custody to the Distributor.

### Act 2: Forwarding to the Retailer
1. Still on the Distributor Dashboard, click **"Inventory"** on the sidebar.
2. Find the batch you just bought and click **"Forward Batch"**.
3. Use the **"Auto-fill Demo Number"** button to paste our test retailer's phone number, and click **"Generate Claim Code"**. 
4. The system will generate a large 6-digit Claim Code.
5. Click the **"Go to Retailer Verification"** prompt on the screen.
6. Enter the 6-digit Claim Code to cryptographically sign for the goods.

### Act 3: The Consumer Scan (The Mic Drop)
1. On the Retailer Success screen, click the massive **"Simulate Consumer Scan"** button. This opens a new tab simulating a customer scanning the QR code on the box in a store.
2. Watch the dramatic "Verifying Ledger" animation.
3. The screen will display **Genuine Product** and render a beautiful timeline showing the complete custody chain (Factory → Distributor → Retailer).
4. At the bottom, enter any phone number and click **"Claim via Nomba"**. This triggers our final Nomba integration: a micro-cashback reward sent via the Nomba Transfer API to thank the consumer for verifying the network!

### 🛑 The Counterfeit Trap
If you want to see the anti-counterfeiting mechanism in action:
Refresh the Consumer Scan page (simulating a second person scanning a copied QR code). The system will instantly turn amber/red and flag **"Product Already Verified"**, effectively destroying the counterfeiter's ability to print duplicate QR codes!

---

## 💻 Local Development (Optional)

*(If you prefer to run the project locally instead of using the live link)*

1. Clone the repository.
2. Navigate to `/backend`, run `npm install`, setup your `.env` with your Nomba credentials and Postgres URL, and run `npm run dev`.
3. Navigate to `/frontend`, run `npm install`, and run `npm run dev`.
4. Open `http://localhost:3000` to begin.
