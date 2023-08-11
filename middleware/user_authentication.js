const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
require("dotenv").config();
require("colors");

exports.verifyToken = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get Token from Header
      token = authorization.split(" ")[1];

      // Verify the Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log(userID);
      // Get User By Token
      req.user = await userModel.findById(userID).select("-password");
      next();
    } catch (error) {
      return res
        .status(500)
        .send({ Status: "Failed", message: "Unauthorised Request" });
    }
  } else {
    res
      .status(400)
      .send({
        Status: "Failed",
        message: "Something Wrong With the Header or Token",
      });
  }
};
