const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");
const {
  adminNotificationEmail,
} = require("../mail/templates/adminNotificationEmail");
require("dotenv").config();
exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } =
    req.body;
  console.log(req.body);
  try {
    const uniqueId = Math.random().toString(36).substring(7);
    // Send confirmation email to user
    const userEmailRes = await mailSender(
      email,
      `Your Data send successfully - (Ref: ${uniqueId})`,
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || "journeyplacement@gmail.com";
    const adminEmailRes = await mailSender(
      adminEmail,
      `New Contact Form Submission - (Ref: ${uniqueId})`,
      adminNotificationEmail(
        email,
        firstname,
        lastname,
        message,
        phoneNo,
        countrycode
      )
    );
    console.log("Admin Email Res:", adminEmailRes);
    console.log("Email Res ", userEmailRes);
    if (userEmailRes && adminEmailRes) {
      return res.status(200).json({
        success: true,
        message: "Emails sent successfully",
      });
    } else {
      throw new Error("Failed to send one or both emails");
    }
  } catch (error) {
    console.error("Error in contactUsController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process contact form submission",
    });
  }
};
