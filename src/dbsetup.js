const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

// Create/connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'parts.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');

        // Create a parts table
        db.run(`
            CREATE TABLE IF NOT EXISTS parts (
            number INT PRIMARY KEY AUTO_INCREMENT,
            description VARCHAR(50) NOT NULL,
            price FLOAT(8,2) NOT NULL,
            weight FLOAT(4,2) NOT NULL,
            pictureURL VARCHAR(50) NOT NULL,
            quantity INT(3) NOT NULL
            )
        `);
    }
});

// API endpoints for parts management
app.post('/parts', (req, res) => {
    const { part_number, name, quantity, location, description } = req.body;
    
    db.run(
        'INSERT INTO parts (part_number, name, quantity, location, description) VALUES (?, ?, ?, ?, ?)',
        [part_number, name, quantity, location, description],
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                part_number,
                name,
                quantity,
                location,
                description
            });
        }
    );
});

// Get all parts
app.get('/parts', (req, res) => {
    db.all('SELECT * FROM parts', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get a specific part by part number
app.get('/parts/:part_number', (req, res) => {
    db.get('SELECT * FROM parts WHERE part_number = ?', [req.params.part_number], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Part not found" });
            return;
        }
        res.json(row);
    });
});

// Update part quantity
app.patch('/parts/:part_number/quantity', (req, res) => {
    const { quantity } = req.body;
    
    db.run(
        'UPDATE parts SET quantity = ?, last_updated = CURRENT_TIMESTAMP WHERE part_number = ?',
        [quantity, req.params.part_number],
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: "Part not found" });
                return;
            }
            res.json({ part_number: req.params.part_number, quantity });
        }
    );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Proper cleanup on app termination
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
