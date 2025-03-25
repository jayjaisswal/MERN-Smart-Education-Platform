const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

// capture the payment and initiate the Rozerpay
exports.capturePayment = async (req, res) => {
  // get courseId and UserId
  const { course_id } = req.body;
  const userId = req.user.body;

  // validation
  if (!course_id) {
    return res.status(400).json({
      message: "Please provide the valid CourseId",
      success: false,
    });
  }

  // valid courseDetail
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // user already pay for the same course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(400).json({
        message: "You have already enrolled for this course",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }

  // order create
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    // initiate the payment using rezorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Payment failed",
      success: false,
    });
  }
};

// verify Signature of Razorpay and Server

exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";
  const razorpaySignature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));

  if (signature === digest) {
    console.log("Signature verified & Payment is Authorised");

    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      // action fullfillment

      // find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          message: "Course not found",
          success: false,
        });
      }

      console.log(enrolledCourse);

      // find the student and add the course to their list enrolled courses
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );

      console.log(enrolledStudent);

      // send confirmation mail
      const emailResponse = await mailSender(
        enrolledStudent.email,
        enrolledCourse.name,
        "Congratulation, you are enrolled into the course "
      );

      console.log(emailResponse);
      return res.status(200).json({
        message: "Signature verified and course Added",
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  } else {
    return res.status(401).json({
      message: "Invalid signature",
      success: false,
    });
  }
};
