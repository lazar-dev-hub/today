const express = require('express');
const cors = require('cors');
const app = express();
const con = require('./database');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = header.slice('Bearer '.length);
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function signToken(user) {
    return jwt.sign(
        { user_id: user.user_id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
}

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

// -----------------------
// Auth (JWT)
// -----------------------

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || typeof username !== 'string' || username.trim().length < 3) {
            return res.status(400).json({ error: 'Username is required (min 3 chars)' });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ error: 'Password is required (min 6 chars)' });
        }

        const safeRole = role || 'customer';

        const existing = await new Promise((resolve, reject) => {
            con.query('SELECT user_id, username, role FROM users WHERE username = ?', [username], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        });

        if (existing) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const insertResult = await new Promise((resolve, reject) => {
            con.query(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashed, safeRole],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });

        return res.status(201).json({ message: 'Registered successfully', userId: insertResult.insertId });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Register failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await new Promise((resolve, reject) => {
            con.query('SELECT user_id, username, role, password FROM users WHERE username = ?', [username], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = signToken(user);
        return res.json({ token, user: { user_id: user.user_id, username: user.username, role: user.role } });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Login failed' });
    }
});

// Me
app.get('/api/auth/me', requireAuth, (req, res) => {
    return res.json({ user: { user_id: req.user.user_id, username: req.user.username, role: req.user.role } });
});

// Logout (stateless)
app.post('/api/auth/logout', (req, res) => {
    // JWTs are stateless; client deletes token.
    return res.json({ message: 'Logged out' });
});

// Starting the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is working well on port ${PORT}`);
});
