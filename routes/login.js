const express = require("express");
const router = express.Router();

module.exports = (db) => {
  



// login
router.post("/api/login", (req, res) => {
    const { fullname, password } = req.body;
  
    const loginQuery = "SELECT * FROM admin WHERE fullname = ? AND password = ?";
  
    db.query(loginQuery, [fullname, password], (err, results) => {
      if (err) {
        console.error("Error during login:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
  
      if (results.length === 1) {
        const user = results[0];
        return res
          .status(200)
          .json({ success: true, message: "Login successful", user });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    });
  });
  
  

  
  
  
  
    return router;
  };