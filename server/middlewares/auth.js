const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth...............................................................................................
exports.auth = async (req, res, next) => {
  try {
    // extract token
     const authHeader = req.header("Authorization");
     console.log("Authorization header:", authHeader);
     const token =
      req.cookies.token ||
      req.body.token ||
      (authHeader && authHeader.replace("Bearer ", "").trim());
      console.log("Token extracted:", token);

    // if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is misssing",
      });
    }

    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decode;
} catch (err) {
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired",
    });
  }
  return res.status(401).json({
    success: false,
    message: "Token is invalid",
  });
}
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isStudent......................................................................................
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students Only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified , please try again",
    });
  }
};

// isInstructor.......................................................................................
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructor Only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified , please try again",
    });
  }
};

// isAdmin............................................................................................
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin Only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified , Please try again",
    });
  }
};
