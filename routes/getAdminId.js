const express = require("express");
const router = express.Router();

module.exports = (db) => {
  

// Get admin by ID
router.get("/api/getAdmin/:id", (req, res) => {
    const productId = req.params.id;
    const sql = "SELECT * FROM admin WHERE id = ?";
  
    db.query(sql, [productId], (err, result) => {
      if (err) {
        console.error("Error fetching product details:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (result.length > 0) {
          res.json(result[0]); // Send the first (and only) product in the result array
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      }
    });
  });
  
  
  
    return router;
  };