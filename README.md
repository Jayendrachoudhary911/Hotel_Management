# 🏰 Aura Grand Palace & Heritage Resort

> A luxury Rajasthani hospitality web platform and enterprise management system for **Aura Grand Palace & Heritage Resort**, nestled along Lake Pichola in Udaipur, Rajasthan.

---

## ⚜️ Overview & Heritage Design System

The platform has been crafted under the **Heritage Rajasthan** design direction:
* **Palette Tokens**:
  * **Warm Ivory** (`#F5F1E8`): Canvas for light, welcoming, readable guest spaces.
  * **Royal Maroon** (`#670E10`): Regal headers, primary CTA buttons, and heritage crest elements.
  * **Espresso** (`#241F1A`): High-contrast typography (> 4.5:1 WCAG compliance) and elegant dark operational interfaces.
  * **Champagne Gold** (`#B08D57`): Restrained decorative filigree, borders, star ratings, and badges.
* **Typography**:
  * *Playfair Display* for royal headings, chamber names, and decorative accents.
  * *DM Sans* for crisp, legible UI elements, prices, and booking forms.
* **Currency Standard**:
  * Full adherence to Indian Rupee (`₹`) minor units (stored as integer paise in the data layer and formatted accurately across all customer and staff surfaces).

---

## 🏛️ Public Guest Experience (WEB-01 – WEB-06)

| Realm | Route | Key Capabilities |
| :--- | :--- | :--- |
| **Palace Portal** | `/` | Hero showcase, quick check-in availability bar, 4 realm highlights, 6 luxury chambers preview, guest reviews, and property credentials. |
| **Royal Chambers** | `/rooms` | Search & filter by capacity, tier, price range, and amenities. Dynamic availability badges. |
| **Chamber Details** | `/rooms/[roomTypeId]` | High-res suites photography, heritage architectural stories, curated amenities, policy breakdown, and direct booking CTA. |
| **Direct Reservation** | `/book` | Date picker, guest counters, automated stay duration & tax calculation, instant booking confirmation, and reference code generation. |
| **Royal Darbar Hall** | `/hall` | Banquet & wedding showcase, package breakdown (Maharani, Rajwada, Royal Corporate), and enquiry pipeline with **Seating Layout selector** (*Rajasthani Baithak, Cluster Tables, Auditorium, U-Shape*). |
| **Darbar Dining** | `/restaurant` | Fine-dining royal thali & Rajasthani specialties, dietary tags (Veg, Non-Veg, Jain), table reservations, and QR dine-in links. |
| **Jharokha Artisan Cafe** | `/cafe` | Artisanal brews, Udaipur single-origin coffees, sweet delicacies, and takeaway ordering. |
| **Dine-in QR Ordering** | `/qr/[token]` | Contactless table ordering with visual cart drawer and live order submission. |
| **Takeaway & Delivery** | `/order/pickup`, `/order/delivery` | Direct online ordering with guest contact, fulfillment options, and live progress tracker. |
| **Live Order Tracking** | `/order-status/[reference]` | Real-time visual timeline (*Received ➔ Preparing ➔ Ready ➔ Delivered*). |

---

## 👑 Staff Operations Console (`/dashboard`)

The staff dashboard provides an enterprise operations cockpit designed in a sleek dark espresso theme (`#181411` / `#241F1A`) with real-time operational flows:

* **Executive Overview (`/dashboard`)**:
  * Live occupancy rate, today's arrivals & departures, live kitchen orders, pending banquet leads, and revenue metrics.
* **Room Reservations (`/dashboard/reservations`)**:
  * Guest check-in / check-out actions, folio lookups, search by booking reference, and direct room assignment.
* **Chamber Inventory & Maintenance (`/dashboard/rooms`)**:
  * Status toggles (*Available, Occupied, Cleaning, Maintenance*), housekeeping assignment, and real-time room grid.
* **Banquet & Event Pipeline (`/dashboard/hall`)**:
  * Lead lifecycle management (*New ➔ Contacted ➔ Quoted ➔ Confirmed ➔ Completed*).
  * Seating layout verification, guest count verification, and quotation generation modal.
* **Kitchen Display System - KDS (`/dashboard/kitchen`)**:
  * Real-time ticket management with fulfillment timer, urgency indicators, and one-tap stage progression (*Mark Preparing ➔ Mark Ready ➔ Mark Collected*).
* **Point of Sale - POS (`/dashboard/pos`)**:
  * Quick-touch terminal for front-desk and waitstaff to dispatch dine-in, room-service, and takeaway orders directly to the kitchen.
* **Culinary Menu Control (`/dashboard/menu`)**:
  * Instant 86'ing (stock toggle), item price adjustments, dietary classification, and category filtering.

---

## 🛠️ Technology Stack & Architecture

* **Framework**: [Next.js 16](https://nextjs.org) with App Router & Turbopack
* **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com) + custom CSS custom properties
* **Icons**: [Lucide React](https://lucide.dev)
* **Date Utilities**: [date-fns](https://date-fns.org)
* **Database & Persistence**:
  * Dual-mode data repository (`src/lib/data/repository.ts`).
  * In-memory seed store for instant, zero-setup local development and automated testing.
  * Complete [Supabase PostgreSQL](https://supabase.com) migrations (`supabase/migrations/001_initial_schema.sql`, `002_rls_policies.sql`, `003_hall_events.sql`) for enterprise multi-tenant cloud deployment.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ or 20+
* npm or pnpm

### 1. Installation
```bash
git clone <repository-url>
cd HotelManagement
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

* Public Portal: [http://localhost:3000](http://localhost:3000)
* Staff Console: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
* KDS (Kitchen): [http://localhost:3000/dashboard/kitchen](http://localhost:3000/dashboard/kitchen)
* Hall Enquiries: [http://localhost:3000/dashboard/hall](http://localhost:3000/dashboard/hall)

### 3. Production Build & Validation
```bash
npm run build
npm run start
```
*Build verified with Next.js 16 compiler outputting 31 statically generated and dynamic route endpoints.*

---

## 📍 Property Information (Configurable - WEB-02)

* **Name**: Aura Grand Palace & Heritage Resort
* **Address**: Lake Palace Road, Pichola, Udaipur, Rajasthan 313001, India
* **Telephone**: +91 (294) 242-8800 / +91 (294) 242-8801
* **Concierge**: reservations@auragrandpalace.com
* **Darbar Dining Hours**: 12:30 PM – 11:00 PM Daily
* **Jharokha Cafe Hours**: 07:00 AM – 11:30 PM Daily
* **Check-in / Check-out**: 02:00 PM / 11:00 AM IST
