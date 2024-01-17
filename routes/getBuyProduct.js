const express = require("express");
const router = express.Router();

module.exports = (db) => {
  


// Fetch all all buy products from the database
router.get('/api/getBuyProduct', (req, res) => {
    const sql = 'SELECT * FROM buy_product';
  
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