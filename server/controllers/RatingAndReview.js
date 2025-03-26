const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

// controllers
// 1 create rating
// 2 get Average Rating
// 3 get all ratings

//1 create RAting
exports.createRating = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;
    // fetchdata from reqbody
    const { rating, review, courseId } = req.body;
    // check if user is enrolled or not if enrolled then create rating
    const isEnrolled = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!isEnrolled) {
      return res.status(404).json({
        message: "You are not enrolled in this course",
        success: false,
      });
    }
    // check if user already review the course
    const isReview = await RatingAndReview.findOne({
      userId: userId,
      courseId: courseId,
    });
    if (isReview) {
      return res.status(400).json({
        message: "You already review this course",
        success: false,
      });
    }

    // create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    // update course with this rating/review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndreviews: ratingReview._id,
        },
      },
      { new: true }
    );

    console.log(updatedCourseDetails);

    // return response
    res.status(201).json({
      message: "Rating and review created successfully",
      success: true,
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
