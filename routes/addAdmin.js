const express = require("express");
const router = express.Router();

module.exports = (db) => {
  




// POST endpoint to handle form submission for Admin
router.post("/api/addAdmin", (req, res) => {
    const { fullname, phoneNumber, rank, password } = req.body;
  
  
  
  
    // Insert data into the MySQL database of Admin
    const sql = "INSERT INTO admin (fullname, phone_number, rank, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [fullname, phoneNumber, rank, password], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            res.status(500).send("Internal Server Error");
        } else {
            console.log("Data inserted into database successfully");
            res.status(200).send("Data inserted successfully");
        }
    });
  });
  
  
  
  
  
  
    return router;
  };