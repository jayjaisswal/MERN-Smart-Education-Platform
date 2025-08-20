const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();
const Profile = require("../models/Profile");

// send OTP steps...................................................................................................
exports.sendotp = async (req, res) => {
  try {
    // step 1 fetch email from request body
    const { email } = req.body;
    //step 2 check if user is already present or not
    const checkUserPresent = await User.findOne({ email });

    //step 3 if user is Already present then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        message: "User already exists",
        status: false,
      });
    }

    //step 4 if user is not present
    // generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log("OTP Generated", otp);

    //step 5 check otp is unique or not
    let checkOTP = await OTP.findOne({ otp });
    while (checkOTP) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      checkOTP = await OTP.findOne({ otp: otp });
    }

    //step 6 save OTP in database
    const saveOTP = await OTP.create({ email, otp: otp });
    console.log("OTP saved in database", saveOTP);

    //step 7 return response successfully
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Try again :${error.message}`,
    });
  }
};

// signup...................................................................................................
exports.signup = async (req, res) => {
  // step 1 fetch data from req. body
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,

      // contactNumber,
      // address,
      otp,
      accountType,
    } = req.body;

    // step 2 validate the data
    // Ensure all the required field must be filled
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      // !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    // check if the Password and Confirm Password are same or not
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Password and Confirm Password must be same",
      });
    }

    // check if the User is already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // find the most recent otp Stored for the User
    // const recentOtp =await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    // console.log(recentOtp);

    // // validate otp
    // if (recentOtp.length == 0) {
    //   //OTP not found
    //   return res.status(400).json({
    //     success: false,
    //     message: "OTP Not Found",
    //   });
    // }
    // // invalid otp
    // else if (recentOtp.otp !== otp) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Invalid OTP",
    //   });
    // }

    // Find the most recent OTP stored for the user
    const recentOtpArray = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtpArray);

    // Validate OTP
    if (recentOtpArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP Not Found",
      });
    }

    // Extract the first (and only) OTP object from the array
    const recentOtp = recentOtpArray[0];

    if (recentOtp.otp !== otp) {
      return res.status(403).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      // contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Registration Failed: ${error.message}`,
    });
  }
};

// Login...................................................................................................
exports.login = async (req, res) => {
  try {
    // get data from req. body
    const { email, password } = req.body;

    // all field must be filled
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please fill all details",
      });
    }

    // check user is exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, Please signup first",
      });
    }

    // generate JWT, after password match
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Loggged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

// Controller for Changing Password.................................................................
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The old password is incorrect" });
    }

    // Match new password and confirm new password
    if (newPassword !== confirmPassword) {
      // If new password and confirm new password do not match, return a 400 (Bad Request) error
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

// change Password...................................................................................................
// exports.changePassword = async (req, res) => {
//   try {
//     // get data from req. body
//     const { oldPassword, newPassword, confirmPassword } = req.body;
//     // validation
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all fields",
//       });
//     }
//     if (await bcrypt.compare(oldPassword, req.user.password)) {
//       if (newPassword !== confirmPassword) {
//         return res.status(400).json({
//           success: false,
//           message: "Passwords do not match",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Old password is incorrect",
//       });
//     }

//     // update password in db
//     const user = await User.findByIdAndUpdate(req.user._id, {
//       $set: {
//         password: await bcrypt.hash(newPassword, 10),
//       },
//       new: true,
//     });
//     // send mail -- password is updated
//     const mailOptions = {
//       from: "kumarprince13833@gmail.com",
//       to: req.user.email,
//       subject: "Password Updated",
//       text: "Your password has been updated",
//     };
//     transport.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return res.status(400).json({
//           success: false,
//           message: "Error sending mail",
//         });
//       }
//     });
//     // send response
//     res.status(200).json({
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Password not updated please try again",
//     });
//   }
// };
