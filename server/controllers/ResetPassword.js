const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPasswordToken...................................................................................................
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req.body
    const email = req.body.email;

    // check user for this email, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }
    // generate token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email }, // filter and update user associated with this emailId
      {
        token: token, // add token to user
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      },
      { new: true } // return updated user
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;
    // send mail containing the url
    await mailSender(
      email,
      "Reset Password",
      `Please click on the link to reset your password: ${url}`
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong while sending reset password mail",
    });
  }
};

//  resetPAssword...................................................................................................
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // check if password and confirm password are same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password should be same",
      });
    }
    //   get user detail from db using token
    const userDetails = await User.findOne({ token: token });
    //   check if user exists
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid token",
      });
    }

    //   token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Password reset link has expired",
      });
    }

    // hash pasword
    const hashedPassword = bcrypt.hash(password, 10);

    // password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      {
        new: true,
      }
    );

    res.status(200).json({
        success: true,
        message: "Password reset successfully",
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Password reset failed",
        });
  }
};
