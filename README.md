# Gearbox Garage Management Workspace

A comprehensive, full-stack automotive repair shop and fleet workspace. Built using **React 19 (Vite)** on the frontend, an **Express (TypeScript)** server, and a fully-featured, secure, file-persistent local database mimicking a MongoDB collection system.

This application is designed to be 100% interactive and functional out-of-the-box inside cloud container runtimes, requiring zero external database credentials.

---

## Technical Architecture

*   **Frontend**: React 19, TypeScript, Tailwind CSS, Motion/React, Lucide-React.
*   **Charts**: Recharts (with fluid responsiveness for viewport adjustment).
*   **Backend**: Node.js Express server, TSX loader for dev execution, Esbuild bundling.
*   **Database**: Custom transactional file-based MongoDB interface (`/server/db.ts`) with disk persistence to `/data/db.json` and automatic schema-aligned mock seeder.

---

## Feature Suite

### 1. Main Dashboard (`DashboardPage`)
*   **Summary Cards**: Active totals of Customers, Fleet Vehicles, Active Repair Pipeline, Outstanding Receivables, and Gross Revenue.
*   **Area Timeline Charts**: Visual 6-month aggregate revenue timeline powered by Recharts.
*   **Visual Distributions**: Service Category density meter tracking where revenues are being generated, alongside a Work Order Queue distribution panel.
*   **System Activity Feed**: Live audit-trail logging customer registration, completed services, status transitions, and cash checkouts.

### 2. Customer Registry (`CustomersPage`)
*   **Member List**: Layout showing avatar indicators, contact cards (email, phone), and membership timelines.
*   **Comprehensive Profiles**: Clicking reviews a deep-dive file of all vehicles owned, historical service invoices, and active diagnostics assigned.
*   **Record Controls**: Securely Register, Update, or Delete customer records with cascading relationship sanitization.

### 3. Vehicle Fleet Ledger (`VehiclesPage`)
*   **Fleet Registry**: Visual ledger matching manufacturer models, mileage indices, plates, and VIN IDs with their customer owner files.
*   **Relational Integrity**: Vehicle registry forms include real-time Customer account selector dropdowns to prevent broken links.

### 4. Completed Service Records (`ServiceRecordsPage`)
*   **Filter Pills**: Filter logs instantly across categories (Engine, Brakes, Tires, Electrical, Maintenance, Transmission, etc.).
*   **Historical Audit**: Fully detailed records matching repair actions, invoiced sums, execution dates, and technicians.

### 5. Diagnostics & Work Orders Queue (`WorkOrdersPage`)
*   **Kanban Status Tabs**: Interactive status-based pipeline filters (Pending, In Progress, Completed, Cancelled).
*   **Quick Transitions**: Hot actions like "Start Work" or "Authorize Complete" directly inside table rows.
*   **Cascade Automation**: Moving a Work Order status to "Completed" trigger automated cascades:
    1.  Auto-issues a custom, structured Billing Invoice (Unpaid stat).
    2.  Auto-creates a historic Service Record matching the description.

### 6. Billing & Invoices (`InvoicesPage`)
*   **Financial Metrics**: Interactive widgets showing Gross Invoiced, cash received, and remaining receivables.
*   **Ledger Cash Processing**: Logging payments instantly adjusts states from Unpaid, Partially Paid, to Paid.
*   **High-fidelity Receipts**: Visual audit slips styled with garage headers, customer entries, line pricing calculation grids, and standard sales tax (8.25%).

---

## Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/api/dashboard/stats` | Fetches aggregate shop statistics and timeline chart metrics. |
| **GET** | `/api/customers` | Retrieves all registered customer files. |
| **POST** | `/api/customers` | Registers a new customer entry. |
| **GET** | `/api/customers/:id` | Detailed query on a specific customer profile with relations. |
| **GET** | `/api/vehicles` | Lists all registered fleet vehicles. |
| **POST** | `/api/vehicles` | Links a chassis vehicle record under a specific owner. |
| **GET** | `/api/services` | Retrieves all maintenance records. |
| **POST** | `/api/services` | Compiles a new executed service log sheet. |
| **GET** | `/api/workorders` | Fetches all diagnostical queue orders. |
| **PUT** | `/api/workorders/:id` | Adjusts job scope, repair statuses, or priorities. (Triggers Cascades!) |
| **GET** | `/api/invoices` | Fetches all billing statements. |
| **PUT** | `/api/invoices/:id` | Processes customer cash payments. |

---

## CLI & Building Commands

### 1. Developer Server (Hot-Reloading Port 3000)
Spins up the dev server that handles compiling and proxying concurrently:
```bash
npm run dev
```

### 2. Production Compilation (Bundled Node Server)
Compiles React assets via Vite, compiles backend files into a self-contained CommonJS target (`dist/server.cjs`) using esbuild, and embeds sourcemaps:
```bash
npm run build
```

### 3. Launching Deployed Builds
Starts the production server cleanly from compiled binaries:
```bash
npm run start
```
