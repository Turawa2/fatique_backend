const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

module.exports = (db) => {
  router.use("/public", express.static(path.join(__dirname, "../client", "public")));

  router.post("/api/buyProduct", async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ submit: false, msg: "No files were uploaded." });
      }

      const uploadDir = path.join(__dirname, "../client/public/evidence");

      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const targetFile = req.files.imgfile;
      const extName = path.extname(targetFile.name);
      const num = crypto.randomInt(10000, 999999);
      const timestamp = Date.now();

      const imgList = [".png", ".jpg", ".jpeg"];
      if (!imgList.includes(extName)) {
        return res.json({ submit: false, msg: "Only jpg, jpeg, and png files are allowed." });
      }

      if (targetFile.size > 2000000) {
        return res.json({ submit: false, msg: "File size should be less than 2 MB." });
      }

      const imgname = `${num}-${timestamp}${extName}`;

      const uploadPath = path.join(uploadDir, imgname);

      targetFile.mv(uploadPath, async (err) => {
        if (err) {
          console.error("Error uploading image:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const data = {
          fullname: req.body.fullname,
          phone_number: req.body.phone_number,
          address: req.body.address,
          image: imgname,
          goods: req.body.goods,
          amount: req.body.amount,
        };

        const sql = "INSERT INTO `buy_product` SET ?";
        db.query(sql, data, (err, result) => {
          if (err) {
            console.error("Error inserting image data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          console.log("Image data inserted");
          res.json({
            submit: true,
            fliname: targetFile.name,
            fullname: req.body.fullname,
            phone_number: req.body.phone_number,
            address: req.body.address,
            goods: req.body.goods,
            amount: req.body.ammount
          });
        });
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
};
