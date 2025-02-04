const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");

// send OTP steps
exports.sendOTP = async (req, res) => {
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
    const saveOTP = await OTP.create({ otp: otp });
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
      message: error.message,
    });
  }
};

// signup
exports.signUp = async (req, res) => {
  // step 1 fetch data from req. body
  try {
    const [
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      // address,
      otp,
      accountType,
    ] = req.body;

    // step 2 validate the data
    // Ensure all the required field must be filled
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
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
    const existingUser = User.find({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // find the most recent otp Stored for the User
    const recentOtp = OTP.find({ email }).sort({ createdAt: -1 }.limit(1));
    console.log(recentOtp);

    // validate otp
    if (recentOtp !== otp) {
      return res.status(403).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create in DB
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Registration Failed, please try again",
      message: error.message,
    });
  }
};
