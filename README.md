
# Event Management System

An event management system with maintenance, reports, and transactions modules built using React, Node.js, and MySQL.

## Features

- Role-based access control (Admin/User)
- Membership management (Add/Update)
- Event registration
- Payment processing
- Reports generation
- Session management

## Technology Stack

- **Frontend**: React with React Router
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: Session-based with express-session

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Set up the database using the schema in `database.sql`
4. Configure environment variables (optional, defaults are in the code):
   - DB_HOST: Database host (default: localhost)
   - DB_USER: Database user (default: root)
   - DB_PASSWORD: Database password (default: empty)
   - DB_NAME: Database name (default: event_management_system)
   - DB_PORT: Database port (default: 3306)
   - SESSION_SECRET: Session secret (default: your-secret-key-here)

## Running the Application

1. Start the MySQL database server
2. Run the database schema from `database.sql`
3. Start the backend server:
   ```bash
   npm run dev
   ```
4. In a separate terminal, start the frontend:
   ```bash
   cd client
   npm start
   ```

## Default Credentials

- Admin: username: `admin`, password: `admin123`
- User: username: `user`, password: `user123`

## Modules

### Maintenance Module (Admin Only)
- Add Membership: All fields mandatory, select duration (6 months [default], 1 year, 2 years)
- Update Membership: Enter membership number to auto-populate fields, extend or cancel membership

### Reports Module (All Users)
- Membership Report: View all memberships with filtering options
- Transaction Report: View all transactions

### Transactions Module (All Users)
- Event Registration: Register for events
- Payment Processing: Process payments

## Security Features

- Password hashing
- Session management
- Role-based access control
- Input validation

## Folder Structure

```
axiom/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── maintenance/
│   │   │   ├── reports/
│   │   │   └── transactions/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
├── server/                 # Node.js backend
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── models/
│   ├── utils/
│   └── server.js
├── database.sql            # Database schema
├── package.json
└── README.md
```
