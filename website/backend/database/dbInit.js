const db = require('./database'); // Adjust the path to your actual database connection file

function initializeData() {
    db.query('SELECT COUNT(*) AS count FROM lights', (err, results) => {
        if (err) {
            console.error('Error checking lights data:', err);
            return;
        }

        if (results[0].count === 0) {  // No data present, insert default data
            db.query(
                'INSERT INTO lights (name, status, control_type) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
                ['Street Light 1', 'Off', 'Auto', 'Street Light 2', 'Off', 'Auto', 'Street Light 3', 'Off', 'Auto'],
                (err) => {
                    if (err) {
                        console.error('Error inserting initial data:', err);
                    } else {
                        console.log('Successfully inserted initial lights data.');
                    }
                }
            );
        } else {
            console.log('Lights data already initialized.');
        }
    });
}

module.exports = initializeData;