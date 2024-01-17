const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const crypto = require("crypto");
const addProduct = require("./routes/addProduct");
const getProduct = require("./routes/getProduct");
const getProductId = require("./routes/getProductId");
const deleteAdmin = require("./routes/deleteAdmin");
const editAdmin = require("./routes/editAdmin");
const getAdminId = require("./routes/getAdminId");
const getAdmin = require("./routes/getAdmin");
const addAdmin = require("./routes/addAdmin");
const deleteProductId = require("./routes/deleteProductId");
const editProductId = require("./routes/editProductId");
const buyProduct = require("./routes/buyProduct");
const getBuyProduct = require("./routes/getBuyProduct");
const history = require("./routes/history");
const getHistory = require("./routes/getHistory");
const login = require("./routes/login");

require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const PORT = process.env.PORT || 9000;



app.get("/", (req, res) => {
  res.send("Welcome to the node-express-mysql app");
});






//App uses
app.use(addProduct(db));
app.use(getProduct(db));
app.use(getProductId(db));
app.use(deleteAdmin(db));
app.use(editAdmin(db));
app.use(getAdminId(db));
app.use(getAdmin(db));
app.use(addAdmin(db));
app.use(deleteProductId(db));
app.use(editProductId(db));
app.use(buyProduct(db));
app.use(getBuyProduct(db));
app.use(history(db));
app.use(getHistory(db));
app.use(login(db));

app.listen(PORT, () => {
  console.log("Mother Fucker is running on Port", PORT);
});
