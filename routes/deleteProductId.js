const express = require("express");
const router = express.Router();

module.exports = (db) => {
  



// Delete product by ID
router.delete("/api/deleteProduct/:id", (req, res) => {
    const productId = req.params.id;
  
    const sql = "DELETE FROM add_product WHERE id = ?";
    db.query(sql, [productId], (err, result) => {
      if (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ success: true, message: "Product deleted successfully" });
      }
    });
  });
  
  
  
  
  
    return router;
  };