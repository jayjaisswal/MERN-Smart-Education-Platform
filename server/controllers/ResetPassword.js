const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
require("dotenv").config();

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
    const baseUrl =
      process.env.PRODUCTION_FRONTEND_URL || process.env.FRONTEND_URL;
    const url = `${baseUrl}/update-password/${token}`;
    // send mail containing the url
    // ...existing code...

    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              .container {
                  font-family: Arial, sans-serif;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f9f9f9;
              }
              .header {
                  background: linear-gradient(to right, #2563eb, #059669);
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
              }
                  .logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
        }
              .content {
                  background: white;
                  padding: 20px;
                  border-radius: 0 0 10px 10px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background: linear-gradient(to right, #2563eb, #059669);
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #666;
                  font-size: 12px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://res.cloudinary.com/dtspyzore/image/upload/v1755887160/logo.png" alt="Padho India Logo" class="logo"/>
                  <h1>Padho India</h1>
              </div>
              <div class="content">
                  <h2>Password Reset Request</h2>
                  <p>Hello,</p>
                  <p>We received a request to reset your password for your Padho India account. Click the button below to reset it:</p>
                  <div style="text-align: center;">
                      <a href="${url}" class="button">Reset Password</a>
                  </div>
                  <p>This link will expire in 5 minutes for security reasons.</p>
                  <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                  <p>Best regards,<br>The Padho India Team</p>
              </div>
              <div class="footer">
                  <p>This is an automated message, please do not reply to this email.</p>
                  <p>© ${new Date().getFullYear()} Padho India. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `;

    // Update the mailSender call
    await mailSender(email, "Reset Your Padho India Password", emailBody);

    // ...existing code...
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
    const hashedPassword = await bcrypt.hash(password, 10);

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
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};
