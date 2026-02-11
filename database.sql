-- Event Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS event_management_system;
USE event_management_system;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memberships table
CREATE TABLE memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    membership_type ENUM('6_months', '1_year', '2_years') DEFAULT '6_months',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    capacity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES ('admin', '$2a$10$8K1p/aWBGzXTt7giNHI0HObUL.xQJy.Ee.Lm.Nh.aEoJaMJ5BwlEq', 'admin'); -- admin123

-- Insert default user (password: user123)
INSERT INTO users (username, password, role) VALUES ('user', '$2a$10$8K1p/aWBGzXTt7giNHI0HObUL.xQJy.Ee.Lm.Nh.aEoJaMJ5BwlEq', 'user'); -- user123
