# Event Management System (AxioM)

A comprehensive event management system built with React and Node.js/Express, designed to streamline event coordination, membership management, and transaction processing for organizations.

## 🌟 Features

- **User Authentication**: Secure login/logout with role-based access control (admin/user)
- **Member Management**: Complete CRUD operations for member data
- **Event Registration**: Streamlined event registration and attendance tracking
- **Payment Processing**: Secure transaction handling and payment integration
- **Reporting**: Detailed analytics for memberships and financial transactions
- **Navigation Chart**: Easy access to system flow chart from all pages

## 🛠️ Tech Stack

### Frontend
- **React** - Component-based UI library
- **React Router** - Client-side routing
- **CSS Styling** - Custom styling with gradient designs

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MySQL** - Relational database management system
- **Express-session** - Session management
- **BCrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

## 📁 Directory Structure

```
event-management-system/
├── client/                    # React frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── common/       # Common/shared components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── maintenance/  # Maintenance components
│   │   │   ├── reports/      # Reporting components
│   │   │   └── transactions/ # Transaction components
│   │   └── App.js            # Main application component
├── server/                   # Node.js backend
│   ├── config/               # Configuration files
│   ├── middleware/           # Middleware functions
│   ├── routes/               # API route handlers
│   ├── utils/                # Utility functions
│   └── server.js             # Main server file
├── database.sql              # Database schema
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

### Common Components
- **Navbar.js** - Shared navigation bar with chart link accessible from all pages
- **ChartPage.js** - Visual representation of system navigation flow

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-management-system
```

2. Install backend dependencies:
```bash
npm install
```

3. Navigate to client directory and install frontend dependencies:
```bash
cd client
npm install
```

4. Return to root directory:
```bash
cd ..
```

5. Create a `.env` file in the root directory with the following content:
```env
DB_HOST=localhost
DB_USER=ems_user
DB_PASSWORD=ems_password
DB_NAME=event_management_system
DB_PORT=3306
SESSION_SECRET=your-secret-key-here-change-in-production
PORT=3001
```

6. Set up the database:
```bash
# Make sure MySQL is running
# Import the database schema
mysql -u root -p < database.sql
```

## 🛠️ Running the Application

### Development Mode

1. Start the backend server:
```bash
npm run dev
```

2. In a separate terminal, start the frontend server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Default Login Credentials

- **Admin User**:
  - Username: `admin`
  - Password: `admin123`

- **Regular User**:
  - Username: `user`
  - Password: `user123`

## 🔐 Security Features

- Session-based authentication with secure cookies
- Password encryption using BCrypt
- Input validation to prevent injection attacks
- CORS configuration for secure cross-origin requests
- Role-based access control

## 📊 Modules

### 1. Common Components
- **Navigation Bar**: Shared navigation with "Flow Chart" link accessible from all pages
- **Chart Page**: Visual representation of system navigation flow

### 2. Maintenance Module (Admin Only)
- Add/Update Membership
- Member List Management

### 3. Reports Module (All Users)
- Membership Reports
- Transaction Reports

### 4. Transactions Module (All Users)
- Event Registration
- Payment Processing

## 🗂️ Database Schema

The system uses a MySQL database with the following tables:
- `users` - User accounts with roles
- `memberships` - Member information and status
- `transactions` - Financial transactions
- `events` - Event information

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Check session status

### Memberships
- `GET /api/memberships` - Get all memberships
- `POST /api/memberships/add` - Add new membership
- `PUT /api/memberships/update/:id` - Update membership
- `GET /api/memberships/number/:number` - Get membership by number

### Transactions
- `GET /api/transactions` - Get all transactions (admin)
- `GET /api/transactions/user/:userId` - Get user transactions
- `POST /api/transactions` - Create new transaction

## 🚦 Navigation Chart Feature

The application includes a navigation chart accessible from all pages via the "Flow Chart" link in the header. This feature provides users with a visual representation of the system's navigation structure, making it easy to understand the application flow.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please create an issue in the repository.