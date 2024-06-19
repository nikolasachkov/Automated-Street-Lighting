const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '123Tommy456magi!', // replace with your MySQL password
    database: 'street_light_db'
});

function updateLightStatus(id, status, callback) {
    const sql = 'UPDATE lights SET status = ? WHERE id = ?';
    db.query(sql, [status, id], function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;