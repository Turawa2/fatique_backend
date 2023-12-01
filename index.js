const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "car_checkerdb",
});

// login
app.post("/api/login", (req, res) => {
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

// API for posting incoming cars from React to two tables in the database.
app.post("/api/post/incomingCars", (req, res) => {
  const { number, tally, gender, date, time, documenter } = req.body;

  const sqlInsertCars =
    "INSERT INTO cars (number, tally, gender, date, time, documenter) VALUES (?, ?, ?, ?, ?, ?)";

  const sqlInsertHistory =
    "INSERT INTO history (number, tally, gender, date, time, documenter) VALUES (?, ?, ?, ?, ?, ?)";

  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      return res.status(500).send(transactionErr.message);
    }

    db.query(
      sqlInsertCars,
      [number, tally, gender, date, time, documenter],
      (error1, result1) => {
        if (error1) {
          db.rollback(() => {
            return res.status(400).send("Error inserting into cars table");
          });
        } else {
          db.query(
            sqlInsertHistory,
            [number, tally, gender, date, time, documenter],
            (error2, result2) => {
              if (error2) {
                db.rollback(() => {
                  return res
                    .status(400)
                    .send("Error inserting into history table");
                });
              } else {
                db.commit((commitErr) => {
                  if (commitErr) {
                    db.rollback(() => {
                      return res.status(500).send("Transaction commit error");
                    });
                  } else {
                    res.send("Data inserted into both tables successfully!");
                  }
                });
              }
            }
          );
        }
      }
    );
  });
});

//image directories
app.use("/public", express.static(path.join(__dirname, "../client", "public")));

app.get("/", (req, res) => {
  res.send("Welcome to the node-express-mysql app");
});

//upload image

app.post("/upload", (req, res) => {
  const data = {
    fullname: req.body.fullname,
    rank: req.body.rank,
    image: req.body.image,
  };

  const sql = "INSERT INTO `admin` SET ?";
  db.query(sql, data, (err, result) => {
    if (err) {
      console.error("Error inserting image data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Image data inserted");
      res.status(200).json({ success: true });
    }
  });
});

app.post("/api/admin", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ submit: false, msg: "No files were uploaded." });
  }

  const targetFile = req.files.imgfile;
  const extName = path.extname(targetFile.name);

  try {
    const num = crypto.randomInt(10000, 999999);
    const uploadDir = path.join(
      __dirname,
      "../client",
      "public",
      "upload",
      num + targetFile.name
    );
    const imgList = [".png", ".jpg", ".jpeg"];

    if (!imgList.includes(extName)) {
      return res.json({
        submit: false,
        msg: "Only jpg, jpeg, and png files are allowed.",
      });
    }

    if (targetFile.size > 2000000) {
      return res.json({
        submit: false,
        msg: "File size should be less than 2 MB.",
      });
    }

    targetFile.mv(uploadDir, async (err) => {
      if (err) {
        console.error("Error uploading image:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const imgname = num + targetFile.name;

      const data = {
        fullname: req.body.fullname,
        rank: req.body.rank,
        password: req.body.password,
        image: imgname,
      };

      const sql = "INSERT INTO `admin` SET ?";
      db.query(sql, data, (err, result) => {
        if (err) {
          console.error("Error inserting image data:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        console.log("Image data inserted");
        res.json({
          submit: true,
          fliname: targetFile.name,
          fullname: data.fullname,
          rank: data.rank,
          password: data.password,
        });
      });
    });
  } catch (error) {
    console.error("Error generating random number:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//update

app.put("/api/admin/:id", async (req, res) => {
  const adminId = req.params.id;

  const checkAdminQuery = "SELECT * FROM admin WHERE id = ?";
  db.query(checkAdminQuery, [adminId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking admin existence:", checkErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const existingAdmin = checkResult[0];

    const updatedAdmin = {
      fullname: req.body.fullname || existingAdmin.fullname,
      rank: req.body.rank || existingAdmin.rank,
      password: req.body.password || existingAdmin.password,
    };

    const updateQuery = "UPDATE admin SET ? WHERE id = ?";
    db.query(
      updateQuery,
      [updatedAdmin, adminId],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating admin details:", updateErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json({ success: true });
      }
    );
  });
});

//delete
app.delete("/api/admin/:id", (req, res) => {
  const adminId = req.params.id;

  const deleteQuery = "DELETE FROM admin WHERE id = ?";
  db.query(deleteQuery, [adminId], (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.error("Error deleting admin:", deleteErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json({ success: true });
  });
});

//fetching admin
app.get("/api/getImages", (req, res) => {
  const sql = "SELECT * FROM admin";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

//fetching cars
app.get("/api/getIncomingCars", (req, res) => {
  const sql = "SELECT * FROM cars";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

//fetching history
app.get("/api/getHistoryCars", (req, res) => {
  const sql = "SELECT * FROM history";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// API endpoint to delete a car by ID
app.delete("/api/delete/car/:id", (req, res) => {
  const customerId = req.params.id;

  // Define the SQL query to delete a car by ID
  const sqlDeleteCustomer = "DELETE FROM cars WHERE id = ?";

  // Execute the query to delete the car
  db.query(sqlDeleteCustomer, [customerId], (error, result) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    res.send("Out!");
  });
});

// Route to get total cars
app.get("/api/totalCars", (req, res) => {
  const sql = "SELECT COUNT(*) as total FROM history";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    const totalCars = result[0].total;
    res.json({ totalCars });
  });
});

//starting port

app.listen(PORT, () => {
  console.log("Mother Fucker Is Runing On Port", PORT);
});
