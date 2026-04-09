# Fee Automation System

A full-stack application for automating academic fee payments with a React frontend, Express backend, MySQL database, and Stripe payment gateway integration.

## Features

- **Student Portal** — View fee breakdowns, make online payments via Stripe, and download receipts.
- **Admin Dashboard** — Manage fee structures, view payment status across students, and generate financial reports.
- **Stripe Integration** — Secure online payment processing with real-time transaction tracking.
- **Authentication** — Role-based access for students and administrators.
- **Automated Auditing** — Transaction logging and automated reconciliation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, CSS |
| Backend | Express.js, Node.js |
| Database | MySQL |
| Payments | Stripe API |

## Getting Started

### Prerequisites
- Node.js, MySQL, Stripe API keys

### Installation

```bash
git clone <repo-url>
cd FeeAutomation
cd backend && npm install
cd ../client && npm install
```

### Configuration

Create a `.env` file in the project root with:
- Database credentials (host, user, password, database)
- Stripe secret and publishable keys
- Application port

### Running

```bash
# Terminal 1 — Backend
npm --prefix backend start

# Terminal 2 — Frontend
npm --prefix client start
```

## Project Structure

```
FeeAutomation/
├── client/          # React frontend
│   ├── src/
│   └── public/
├── backend/         # Express API server
│   ├── routes/
│   ├── models/
│   └── config/
├── screens/         # UI screenshots
└── README.md
```

## Authors

Rohan Mukka
