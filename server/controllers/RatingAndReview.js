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

// 2 get Average Rating
exports.getAverageRating = async (req, res) => {
  try{
    // get course id
    const courseId = req.body.courseId;
    // calculate avg rating

    const result = await RatingAndReview.aggregate([
      {
        $match :{  // courseId jo string me hai ushko objectId me change kr rha hai
          course: new mongoose.Type.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id:null, // used to group all the particular courseId
          averageRating: {$avg: "$rating"},
        }
      }
    ])
    // return rating
    if(result.length > 0){
      return res.status(200).json({
        message: "Average Rating found successfully",
        success: true,
        averageRating: result[0].averageRating
        });
    }

    // if no rating/review exist
    return res.status(200).json({
      message: "No Rating/Review found till now",
      success: true,
      averageRating: 0,
    })


  }catch{
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
      });

  }
}

// get AllRating and Reviews
exports.getAllRating = async (req, res) => {
  try{
    const allReviews = await RatingAndReview.find({})
                      .sort({rating:"desc"})
                      .populate({
                        path:"user",
                        select:"firstName, lastName, email, image",
                      })
                      .populate({
                        path:"course",
                        select:"courseName",
                      })
                      .exec();
          return res.status(200).json({
            message: "All Rating and Reviews fetched successfully",
            success: true,
            data: allReviews
          })
    }
  catch{
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
      });

  }
}



