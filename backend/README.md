# EventX Studio Backend

## Setup
1. `cp .env.example .env` and fill values.
2. `npm install`
3. `npm run dev`

## API
- `POST /api/auth/register` {name,email,password,role?}
- `POST /api/auth/login` {email,password}
- `GET /api/auth/me` (Bearer token)

- `GET /api/events` (query: status, q)
- `GET /api/events/:id`
- `POST /api/events` (admin)
- `PUT /api/events/:id` (admin)
- `DELETE /api/events/:id` (admin)

- `POST /api/tickets/book` {eventId, seatNumber} (auth)
- `GET /api/tickets/mine` (auth)
- `POST /api/tickets/checkin/:ticketId` (auth)
