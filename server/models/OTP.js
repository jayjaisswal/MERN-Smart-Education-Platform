const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
    expires: 5 * 60, // // The document will be automatically deleted after 5 minutes of its creation time
  },
});

// a function to send mail
async function sendVerificationEmail(email, otp) {
  try {

    // send mail using mailSender function defined in utils
    const mailResponse = await mailSender(
      email,
      "Verification Email From CodingCombo",
      emailTemplate(otp)
    );
    console.log("Email sent Successfully ", mailResponse);
  } catch (error) {
    console.log("error Occurred while sending mails:", error);
    throw error;
  }
}


// this is premiddleware that is used to send the mail before doc. save
OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  // Only send an email when a new document is created
	if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
    next(); // we go to the next middleware
});

module.exports = mongoose.model("OTP", OTPSchema);
