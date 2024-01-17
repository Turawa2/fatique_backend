// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const fileUpload = require("express-fileupload");
// const path = require("path");
// const crypto = require("crypto");

// const app = express();
// const PORT = process.env.PORT || 9000;

// app.use(cors());
// app.use(express.json());
// app.use(fileUpload());

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "123456",
//   database: "fertilizer_db",
// });




// app.use("/public", express.static(path.join(__dirname, "../client", "public")));

// app.get("/", (req, res) => {
//   res.send("Welcome to the node-express-mysql app");
// });

// app.post("/api/addProduct", async (req, res) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ submit: false, msg: "No files were uploaded." });
//     }

//     const targetFile = req.files.imgfile;
//     const extName = path.extname(targetFile.name);
//     const num = crypto.randomInt(10000, 999999);
//     const timestamp = Date.now();

//     const imgList = [".png", ".jpg", ".jpeg"];
//     if (!imgList.includes(extName)) {
//       return res.json({ submit: false, msg: "Only jpg, jpeg, and png files are allowed." });
//     }

//     if (targetFile.size > 2000000) {
//       return res.json({ submit: false, msg: "File size should be less than 2 MB." });
//     }

//     const uploadDir = path.join(
//       __dirname,
//       "../client",
//       "public",
//       "upload",
//       `${num}-${timestamp}${extName}`
//     );

//     targetFile.mv(uploadDir, async (err) => {
//       if (err) {
//         console.error("Error uploading image:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       const imgname = `${num}-${timestamp}${extName}`;

//       const data = {
//         name: req.body.name,
//         price: req.body.price,
//         description: req.body.description,
//         image: imgname,
//       };

//       const sql = "INSERT INTO `add_product` SET ?";
//       db.query(sql, data, (err, result) => {
//         if (err) {
//           console.error("Error inserting image data:", err);
//           return res.status(500).json({ error: "Internal Server Error" });
//         }

//         console.log("Image data inserted");
//         res.json({
//           submit: true,
//           fliname: targetFile.name,
//           name: data.name,
//           price: data.price,
//           description: data.description,
//         });
//       });
//     });
//   } catch (error) {
//     console.error("Error processing image:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// //fetch products
// app.get("/api/getProduct", (req, res) => {
//   const sql = "SELECT * FROM add_product";

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error fetching images:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });

// // Get product by ID
// app.get("/api/getProduct/:id", (req, res) => {
//   const productId = req.params.id;
//   const sql = "SELECT * FROM add_product WHERE id = ?";

//   db.query(sql, [productId], (err, result) => {
//     if (err) {
//       console.error("Error fetching product details:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       if (result.length > 0) {
//         res.json(result[0]); // Send the first (and only) product in the result array
//       } else {
//         res.status(404).json({ error: "Product not found" });
//       }
//     }
//   });
// });




// // Update product by ID
// app.post("/api/editProduct/:id", (req, res) => {
//   const productId = req.params.id;
//   const updatedProduct = {
//     name: req.body.name,
//     price: req.body.price,
//     description: req.body.description,
//   };

//   const sql = "UPDATE add_product SET ? WHERE id = ?";
//   db.query(sql, [updatedProduct, productId], (err, result) => {
//     if (err) {
//       console.error("Error updating product:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       res.json({ success: true, message: "Product updated successfully" });
//     }
//   });
// });


// // Delete product by ID
// app.delete("/api/deleteProduct/:id", (req, res) => {
//   const productId = req.params.id;

//   const sql = "DELETE FROM add_product WHERE id = ?";
//   db.query(sql, [productId], (err, result) => {
//     if (err) {
//       console.error("Error deleting product:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       res.json({ success: true, message: "Product deleted successfully" });
//     }
//   });
// });


// app.listen(PORT, () => {
//     console.log("Server is running on Port", PORT);
//   });
  