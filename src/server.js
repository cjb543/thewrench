import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Create connections using environment variables
const legacyDB = mysql.createConnection({
  host: process.env.LEGACY_DB_HOST,
  user: process.env.LEGACY_DB_USER,
  password: process.env.LEGACY_DB_PASSWORD,
  database: process.env.LEGACY_DB_NAME
});

const newDB = mysql.createConnection({
  host: process.env.NEW_DB_HOST,
  user: process.env.NEW_DB_USER,
  password: process.env.NEW_DB_PASSWORD,
  database: process.env.NEW_DB_NAME
});

legacyDB.connect((err) => {
  if (err) {
    console.error('Legacy DB connection failed:', err.message);
  } else {
    console.log('Connected to legacy database');
  }
});

newDB.connect((err) => {
  if (err) {
    console.error('New DB connection failed:', err.message);
  } else {
    console.log('Connected to new database');
  }
});

// Define API routes (no changes needed)
app.get('/api/new/fees', (req, res) => {
    newDB.query('SELECT * FROM Fees', (err, results) => {
      if (err) {
        res.status(500).send('Error fetching fees data');
      } else {
        res.json(results);
      }
    });
});

app.get('/api/legacy/parts', (req, res) => {
    legacyDB.query('SELECT * FROM parts', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching parts data');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/new/parts', (req, res) => {
    newDB.query('SELECT number, description, price, weight, pictureURL FROM parts', (err, results) => {
        if (err) {
            console.error('Error fetching new parts:', err);
            res.status(500).json({ error: 'Error fetching new parts', details: err.message });
        } else {
            res.json(results);
        }
    });
});

// Search endpoint for parts
app.get('/api/search/parts', (req, res) => {
  const searchQuery = req.query.q; // Get query parameter
  const query = `
      SELECT number, description, price, weight, pictureURL 
      FROM parts 
      WHERE number LIKE ? OR description LIKE ?`;

  const queryParams = [`%${searchQuery}%`, `%${searchQuery}%`];
  
  newDB.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error searching parts:', err);
          res.status(500).json({ error: 'Error searching parts', details: err.message });
      } else {
          res.json(results);
      }
  });
});