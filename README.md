# Finance Dashboard UI

A responsive finance dashboard built using React, Vite, and Recharts for the Frontend Developer Intern assignment.

## Overview

This project is a frontend-only finance dashboard that allows users to view financial summaries, explore transactions, understand spending patterns, and switch between Viewer and Admin roles.

## Features

- Dashboard summary cards for Total Balance, Total Income, and Total Expenses
- Time-based visualization using a line chart for monthly balance trend
- Categorical visualization using a pie chart for spending breakdown
- Transactions table with search, filtering, and sorting
- Simulated role-based UI with Viewer and Admin modes
- Admin-only transaction form to add new transactions
- Insights section showing highest spending category, monthly comparison, and current month balance
- Responsive layout for desktop and mobile screens
- Empty state handling when no transactions match filters

## Tech Stack

- React
- Vite
- Recharts
- CSS

## Installation

```bash
npm install
npm run dev
```

## Project Structure

```bash
finance-dashboard/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   └── assets/
├── index.html
├── package.json
└── README.md
```

## How it meets the assignment requirements

### 1. Dashboard Overview
The dashboard includes summary cards for balance, income, and expenses, a time-based line chart, and a categorical pie chart.

### 2. Transactions Section
The transactions area displays date, category, type, and amount. It also supports searching, filtering, and sorting.

### 3. Basic Role-Based UI
The app simulates two roles:
- Viewer: can only view data
- Admin: can add transactions using the form

### 4. Insights Section
The dashboard shows:
- Highest spending category
- Monthly expense comparison
- Current month balance

### 5. State Management
Application state is handled using React hooks:
- `useState` for role, filters, form data, and transactions
- `useMemo` for derived calculations like totals, filtered transactions, and chart data

### 6. UI and UX
The interface is clean, readable, responsive, and handles empty transaction results gracefully.

## Notes

- This project uses static/mock data only.
- No backend or database is required.
- The role system is simulated on the frontend as requested in the assignment.

## Author

Manasvi