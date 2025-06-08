# Fee Automation System

This repository hosts a full‑stack application for automating fee payments in an academic setting. The project contains a React frontend and an Express backend that communicate with a MySQL database and Stripe for online transactions.

## Repository structure

- **client/** – React application used by students and administrators
- **backend/** – Express server providing the API and authentication
- **screens/** – Screenshot images referenced by the client README

Each directory contains its own `package.json` so that the frontend and backend can be developed and tested independently.

## Getting started

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd FeeAutomation
   ```
2. Install dependencies for both the frontend and backend
   ```bash
   cd backend && npm install
   cd ../client && npm install
   ```
3. Create a `.env` file in the repository root with the variables described in `client/README.md`. These include database credentials, Stripe keys and the application port.
4. Start the backend and frontend in separate terminals
   ```bash
   npm --prefix backend start
   npm --prefix client start
   ```

## Running tests

The backend uses Jest and Supertest. From the `backend` folder run:
```bash
npm test
```
The React application includes simple tests under `client/src/__tests__`. Run them with:
```bash
npm test --prefix client
```

## License

This project is released under the [MIT License](LICENSE).
