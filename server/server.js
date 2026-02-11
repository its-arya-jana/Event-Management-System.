const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const dbConfig = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const membershipRoutes = require('./routes/memberships');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionStore = new session.MemoryStore();

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  // store: sessionStore, // Using memory store instead of MySQL store
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Debug route for session testing
app.get('/api/debug/session', (req, res) => {
  res.json({
    session: req.session,
    user: req.session?.user,
    isAuthenticated: !!(req.session && req.session.user),
    isAdmin: !!(req.session && req.session.user && req.session.user.role === 'admin')
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/transactions', transactionRoutes);

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});