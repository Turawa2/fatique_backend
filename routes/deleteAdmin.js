const express = require("express");
const router = express.Router();

module.exports = (db) => {
  


// Delete admin by ID
router.delete("/api/deleteAdmin/:id", (req, res) => {
    const productId = req.params.id;
  
    const sql = "DELETE FROM admin WHERE id = ?";
    db.query(sql, [productId], (err, result) => {
      if (err) {
        console.error("Error deleting Admin:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ success: true, message: "Admin deleted successfully" });
      }
    });
  });
  
  
  
    return router;
  };