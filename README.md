# Subscription Management App

A React TypeScript app for managing subscription plans.

## Features

- Browse subscription plans
- Compare plans side by side
- Complete checkout flow
- Manage active subscriptions

## Tech Stack

- React 19 + TypeScript
- Material UI
- React Router
- Jest for testing
- JSON server
- Axios

## Getting Started

```bash
npm install
npm run dev  # Starts both UI and JSON server
```

Open [http://localhost:8080](http://localhost:8080)

## Scripts

- `npm run dev` - Start both React app and JSON server (recommended)
- `npm start` - Development server only (requires json-server running separately)
- `npm run json-server` - Start JSON server only (port 5000)
- `npm test` - Run tests
- `npm run build` - Production build

## API Endpoints

The app uses json-server for a real REST API experience:
- React app: [http://localhost:8080](http://localhost:8080)
- JSON Server: [http://localhost:5000](http://localhost:5000)

API endpoints:
- `GET /plans` - Get all subscription plans
- `GET /plans/:id` - Get a specific plan
- `GET /subscriptions` - Get all subscriptions
- `POST /subscriptions` - Create a new subscription
- `PUT /subscriptions/:id` - Update a subscription

