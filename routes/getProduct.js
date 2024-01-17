const express = require("express");
const router = express.Router();

module.exports = (db) => {
  
    //fetch products
router.get("/api/getProduct", (req, res) => {
    const sql = "SELECT * FROM add_product";
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching images:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    });
  });
  
    return router;
  };