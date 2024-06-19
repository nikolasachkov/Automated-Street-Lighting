const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.use(express.json());

// GET all lights
router.get('/', (req, res) => {
    db.query('SELECT * FROM lights', (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving lights from database');
            return;
        }
        res.json(results);
    });
});

// Update light status
router.put('/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    // Update the query to also change the control_type to 'Manual'
    const query = 'UPDATE lights SET status = ?, control_type = \'Manual\' WHERE id = ?';


    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('Failed to update light:', err);
            res.status(500).send('Failed to update light');
            return;
        }
        res.json({ message: 'Light updated successfully', id: id, status: status, controlType: 'Manual' });
    });
});

module.exports = router;