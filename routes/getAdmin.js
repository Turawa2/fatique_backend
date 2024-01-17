const express = require("express");
const router = express.Router();

module.exports = (db) => {
  


// Fetch all Admin from the database
router.get('/api/getAdmin', (req, res) => {
    const sql = 'SELECT * FROM admin';
  
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching admin:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).json(result);
        }
    });
  });
  
  
  
  
  
  
    return router;
  };