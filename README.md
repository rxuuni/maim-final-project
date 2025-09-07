# EventX Studio (Skeleton)

This zip contains a working skeleton for:
- Backend: Node.js + Express + MongoDB (JWT auth, events CRUD, tickets booking + QR)
- Frontend: React (Vite) + Tailwind (Login/Register, Admin Dashboard, Events, My Tickets)

## Quick Start

### Backend
```
cd backend
cp .env.example .env  # fill MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Create an Admin by registering with role "admin".
