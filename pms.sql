-- Create the PMS Database
CREATE DATABASE IF NOT EXISTS PMS;
USE PMS;

-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'customer', 'staff') NOT NULL
);

-- 2. Customer Table
CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE, -- Optional: Links to a login account if applicable
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 3. Promotion Table
CREATE TABLE promotion (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'scheduled') DEFAULT 'scheduled',
    CONSTRAINT chk_dates CHECK (end_date >= start_date)
);

-- 4. Vehicle Table
CREATE TABLE vehicle (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY, -- Integer PK for faster indexing/joins
    plate_number VARCHAR(20) NOT NULL UNIQUE,   -- Business key kept unique
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year_manufactured INT NOT NULL,
    vehicle_type VARCHAR(50),
    purchase_price DECIMAL(12, 2),
    status ENUM('available', 'rented', 'sold', 'maintenance') DEFAULT 'available'
);

-- 5. Promotion_Vehicle Junction Table
CREATE TABLE promotion_vehicle (
    promotion_id INT,
    vehicle_id INT,
    performance TEXT, -- Notes on how well the promotion did for this vehicle
    PRIMARY KEY (promotion_id, vehicle_id),
    FOREIGN KEY (promotion_id) REFERENCES promotion(promotion_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id) ON DELETE CASCADE
);