const express = require("express");
const router = express.Router();

module.exports = (db) => {
  

// Update admin by ID
router.post("/api/editAdmin/:id", (req, res) => {
    const productId = req.params.id;
    const updatedProduct = {
      fullname: req.body.fullname,
      phone_number: req.body.phoneNumber,
      rank: req.body.rank,
      password: req.body.password,
    };
  
    const sql = "UPDATE admin SET ? WHERE id = ?";
    db.query(sql, [updatedProduct, productId], (err, result) => {
      if (err) {
        console.error("Error updating Admin:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ success: true, message: "Admin updated successfully" });
      }
    });
  });

  
  
    return router;
  };