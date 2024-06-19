const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const db = require('./database/database'); // Adjust path as necessary
const dbInit = require('./database/dbInit'); // Ensure the correct path

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const httpPort = 3000; // Use httpPort instead of port to avoid conflicts

// Setup static files serving and initial route
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'lights-control.html'));
});

// Setup and configure serial communication
const serialPort = new SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', data => {
    console.log('Received from serial:', data);
    const [id, status] = data.split(':');
    if (id && status) {
        updateLightStatus(parseInt(id), status.trim(), 'auto');
    }
});

serialPort.on('error', err => {
    console.error('Serial port error:', err.message);
});

// Handle WebSocket connections
wss.on('connection', ws => {
    console.log('WebSocket connection established');

    ws.on('message', message => {
        console.log('Received message from web client:', message);
        const { id, status } = JSON.parse(message);
        const command = `${id}:${status}`;
        serialPort.write(command, err => {
            if (err) {
                console.error('Failed to send message to serial port:', err);
            } else {
                console.log('Sent to serial port:', command);
            }
        });
        updateLightStatus(id, status, 'manual');
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

// New Route for GET all lights
app.get('/api/lights', (req, res) => {
    db.query('SELECT * FROM lights', (err, results) => {
        if (err) {
            console.error('Error retrieving lights from database:', err);
            res.status(500).send('Error retrieving lights from database');
            return;
        }
        res.json(results);
    });
});

const lightRoutes = require('./routes/lights');  // Adjust the path to where your lights router is defined
app.use('/api/lights', lightRoutes);

// Function to update light status in database and notify clients
function updateLightStatus(id, status, type) {
    db.updateLightStatus(id, status, type, (err) => {
        if (err) {
            console.error('Database update failed:', err);
            return;
        }
        const message = JSON.stringify({ id, status });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
}

// Start server
server.listen(httpPort, () => {
    console.log(`Server running on http://localhost:${httpPort}`);
});

// Initialize database
dbInit();