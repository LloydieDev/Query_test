const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Parser } = require('json2csv');

const app = express();
const PORT = 3000;

// Middleware to enable CORS for frontend requests
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Set up MySQL connection
const connection = mysql.createConnection({
    host: '207.188.12.162',
    user: 'JLEreports',
    password: 'Nv932Sjaab29450Dkk4090Dll409Sbh3',
    database: 'asterisk'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Endpoint to fetch JSON data
app.get('/api/data', (req, res) => {
    const query = 'SELECT * FROM vicidial_log_archive LIMIT 1000';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Database query error' });
            return;
        }

        // Send the data as a JSON response
        res.json(results);
    });
});

// Endpoint to generate and download CSV
app.get('/api/data-to-csv', (req, res) => {
    const query = 'SELECT * FROM vicidial_log_archive LIMIT 50000';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Database query error' });
            return;
        }

        try {
            // Convert data to CSV
            const fields = Object.keys(results[0]);
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(results);

            // Save CSV to a file
            const csvFilePath = path.join(__dirname, 'data.csv');
            fs.writeFileSync(csvFilePath, csv);

            console.log('CSV file created at:', csvFilePath);

            // Send CSV file as a response
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send(csv);
        } catch (csvError) {
            console.error('Error generating CSV:', csvError);
            res.status(500).json({ error: 'CSV generation error' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
