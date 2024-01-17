const express = require("express");
const router = express.Router();

module.exports = (db) => {
  

//review reire it post in the database and also delete them immediatly
router.post("/api/history", async (req, res) => {
    try {
      const retireeData = req.body;
  
      // Remove the 'image' property
    //   delete retireeData.image;
  
      // Insert the reviewed retiree data into the history table
      const historySql = "INSERT INTO `history` SET ?";
      db.query(historySql, retireeData, (err, result) => {
        if (err) {
          console.error("Error inserting reviewed retiree data into history table:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        // Delete the retiree data from the retire_form table
        const deleteSql = "DELETE FROM `buy_product` WHERE id = ?";
        db.query(deleteSql, [retireeData.id], (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error("Error deleting retiree data from retire_form table:", deleteErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }
  
          console.log("Retiree data moved to history and deleted from retire_form successfully");
          res.json({ success: true, message: "Retiree data moved to history and deleted from retire_form successfully" });
        });
      });
    } catch (error) {
      console.error("Error reviewing retiree:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  
  
  
  
  
    return router;
  };