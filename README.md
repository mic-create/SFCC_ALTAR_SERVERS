# SFCC Altar Servers Attendance Management System

A futuristic, high-performance administrative web application designed for the Altar Servers Association of St. Francis Catholic Church (SFCC), Idimu.

---

## Technical Stack
- **Frontend**: Standard HTML5, Cyberpunk Futuristic CSS3 (Glassmorphism, Neon Accents), Modular Vanilla JavaScript (ES6+ fetch API).
- **Backend**: Node.js, Express.js (REST API architecture).
- **Database**: PostgreSQL (Supabase Compatible).
- **Authentication**: JWT (JSON Web Tokens), `bcryptjs` password hashing.
- **CSV Engine**: `csv-parser` with row validation and duplicate detection algorithms.

---

## Setup Instructions

### 1. Database Setup
Execute the SQL files located in `database/` against your PostgreSQL server or Supabase SQL Editor:
```bash
psql -U postgres -d sfcc_attendance -f database/schema.sql
psql -U postgres -d sfcc_attendance -f database/seed.sql