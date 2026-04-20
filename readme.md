# 🏭 Avadhoot Auto Components
### B2B Manufacturing & Inventory Management System

A premium, full-stack B2B platform built for **Avadhoot Auto Components, Pune** — 
a precision machined components manufacturer serving the Automotive, Construction, 
and Hydraulic industries since 2004.

> Third Year Industry Project — VIIT Pune  
> Industry Partner: Avadhoot Auto Components

---

## ✨ What Was Built

This project involved a complete ground-up frontend redesign of an existing 
inventory management system, along with backend authentication, WhatsApp 
integration, and full-stack debugging.

The new frontend features an "Industrial Midnight" dark theme with cinematic 
animations, video backgrounds, and a premium B2B UI.

### Frontend Redesign
- Cinematic logo intro animation on page load
- Full landing page with 3 AI-generated video backgrounds
- Scrolling trust bar, animated stat counters, product showcase
- Facilities section, Why Choose Us, Portal CTA with spark explosion video
- Premium login page with split-panel video background
- Complete app UI restyled — Dashboard, Invoices, Inventory, Clients, 
  Suppliers, Profile, About, Products

### Backend Development
- JWT-based authentication system — secure login, token generation, 
  protected route middleware
- WhatsApp invoicing integration via Twilio — dispatch formal B2B invoices 
  and payment reminders directly to clients
- Full-stack debugging — API route fixes, CORS configuration, port 
  resolution, MongoDB connection stability

### App Features
- 🧾 B2B Supplier & Customer Management
- 📄 Rapid Industrial Billing with GST support
- 📦 Barcode Infrastructure for component tracking
- 📲 WhatsApp Invoicing via Twilio
- 📊 Executive Analytics Dashboard — Revenue Telemetry, Activity Log
- 🔍 Component Inventory with stock level alerts
- 👥 B2B Client Directory with Purchase Ledger

---

## 🎨 Design System — Industrial Midnight

| Token | Value | Usage |
|---|---|---|
| Background | `#080C14` | Page background |
| Surface | `#0F1927` | Cards, panels |
| Card | `#111C2D` | Nested elements |
| Accent Blue | `#0EA5E9` | Primary accent |
| Accent Amber | `#F59E0B` | Money, rates, warnings |
| Text Primary | `#E2E8F0` | Headings |
| Text Muted | `#94A3B8` | Body text |

---

## 🛠️ Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- CSS Keyframe Animations
- Lucide React Icons

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Cloudinary (component images)
- Twilio (WhatsApp invoicing)
- JWT Authentication

---

## 💻 Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/trolog5369/TY-Industry-Project.git
cd TY-Industry-Project
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
```

Start backend:
```bash
npm run server
```

### 3. Frontend setup
```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend runs at `http://localhost:5000`

---

## 👥 Team

| Name | Role |
|---|---|
| Pranav Gaikwad | Frontend Design & Development, JWT Authentication, WhatsApp Integration, Full-stack Debugging |
| Yash Shende | Backend Architecture, Database Design, API Development |

---

## 🏢 Industry Partner

**Avadhoot Auto Components**  
Gat No. 1635, Vrudhashram Road, Ramdasnagar, Chikhali, Pune-411062  
ISO 1461 Certified | Est. 2004  
[avadhootauto.com](https://avadhootauto.com)
