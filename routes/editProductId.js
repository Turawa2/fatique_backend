const express = require("express");
const router = express.Router();

module.exports = (db) => {
  


// Update product by ID
router.post("/api/editProduct/:id", (req, res) => {
    const productId = req.params.id;
    const updatedProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    };
  
    const sql = "UPDATE add_product SET ? WHERE id = ?";
    db.query(sql, [updatedProduct, productId], (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ success: true, message: "Product updated successfully" });
      }
    });
  });
  
  
  
  
  
    return router;
  };