const express = require("express");
const app = express();

const bodyparser = require("body-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("colors");

// DB Connection
const dbconnect = require("./config/dbconnect");

// User Routes
const userroute = require("./routes/userRoute");


// basic middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Server Home Page
app.get("/", (req, res) => {
  res.send("Server is working");
});

// DataBase Connection
dbconnect.dbconnect();

//Routes
app.use("/User", userroute);

app.listen(process.env.PORT, () => {
  console.log(
    `Server is Runnning On http://localhost:${process.env.PORT}`.bgMagenta.green
  );
});
