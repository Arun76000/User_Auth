const mongoose = require("mongoose");
require("colors");
require("dotenv").config();

exports.dbconnect = async (DataBaseUrl) => {
  try {
    const DataBaseUrl = process.env.MONGODB_URI;
    const DBName ="/UserLogin";
    const str = "DataBase Connected SuccessFully";
    await mongoose.connect(DataBaseUrl+DBName);
    console.log(str.bgGreen.yellow);
  } catch (error) {
    console.log(error);
  }
};

// module.exports=dbconnect;
