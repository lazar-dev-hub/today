const express = require('express');
const cors = require('cors');
const app = express();
const con = require('./database');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Create a new user
app.post('/api/users', (req, res) => {
    const { username, password, role } = req.body;
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    
    con.query(query, [username, password, role], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
});

// Get all users from the users table
app.get('/api/users', (req, res) => {
    const query = 'SELECT user_id, username, role FROM users';
    
    con.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// Create a customer
app.post('/api/customers', (req, res) => {
    const { user_id, first_name, last_name, email, phone_number, status } = req.body;
    const query = 'INSERT INTO customer (user_id, first_name, last_name, email, phone_number, status) VALUES (?, ?, ?, ?, ?, ?)';
    
    con.query(query, [user_id || null, first_name, last_name, email, phone_number, status || 'active'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Customer registered', customerId: result.insertId });
    });
});

// Get all customers 
app.get('/api/customers', (req, res) => {
    const query = `
        SELECT c.*, u.username, u.role 
        FROM customer c 
        LEFT JOIN users u ON c.user_id = u.user_id
    `;
    
    con.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// Add a vehicle
app.post('/api/vehicles', (req, res) => {
    const { plate_number, brand, model, year_manufactured, vehicle_type, purchase_price, status } = req.body;
    const query = 'INSERT INTO vehicle (plate_number, brand, model, year_manufactured, vehicle_type, purchase_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    con.query(query, [plate_number, brand, model, year_manufactured, vehicle_type, purchase_price, status || 'available'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Vehicle added successfully', vehicleId: result.insertId });
    });
});

// Update vehicle details
app.put('/api/vehicles/:id', (req, res) => {
    const { id } = req.params;
    const { plate_number, brand, model, year_manufactured, vehicle_type, purchase_price, status } = req.body;
    const query = 'UPDATE vehicle SET plate_number=?, brand=?, model=?, year_manufactured=?, vehicle_type=?, purchase_price=?, status=? WHERE vehicle_id=?';
    
    con.query(query, [plate_number, brand, model, year_manufactured, vehicle_type, purchase_price, status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Vehicle updated successfully' });
    });
});

// Delete a vehicle
app.delete('/api/vehicles/:id', (req, res) => {
    const query = 'DELETE FROM vehicle WHERE vehicle_id = ?';
    
    con.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Vehicle removed successfully' });
    });
});


// Get all promotions
app.get('/api/promotions', (req, res) => {
    const query = 'SELECT * FROM promotion ORDER BY start_date DESC';
    
    con.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Create a new promotion campaign
app.post('/api/promotions', (req, res) => {
    const { title, description, discount_type, discount_value, start_date, end_date, status } = req.body;
    const query = 'INSERT INTO promotion (title, description, discount_type, discount_value, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    con.query(query, [title, description, discount_type, discount_value, start_date, end_date, status || 'scheduled'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Promotion created', promotionId: result.insertId });
    });
});


// Link a promotion to a vehicle
app.post('/api/promotions/link-vehicle', (req, res) => {
    const { promotion_id, vehicle_id, performance } = req.body;
    const query = 'INSERT INTO promotion_vehicle (promotion_id, vehicle_id, performance) VALUES (?, ?, ?)';
    
    con.query(query, [promotion_id, vehicle_id, performance || null], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Promotion linked to vehicle successfully' });
    });
});

// Get vehicles with their active promotion details
app.get('/api/vehicles-with-promotions', (req, res) => {
    const query = `
        SELECT v.vehicle_id, v.plate_number, v.brand, v.model, p.title as promo_title, p.discount_value, pv.performance
        FROM vehicle v
        LEFT JOIN promotion_vehicle pv ON v.vehicle_id = pv.vehicle_id
        LEFT JOIN promotion p ON pv.promotion_id = p.promotion_id
    `;
    
    con.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Starting the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is working well on port ${PORT}`);
});
