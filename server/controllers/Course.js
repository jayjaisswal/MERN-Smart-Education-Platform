const Course = require("../models/Course");
const Tags = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// createCourse Handler function
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // get thumbnail
    const thumbnail = req.file.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // check for Instructor
    const instructorDetails = await User.findById(req.user.id);
    // req.user.id means the user who is logged in

    // check for instructor
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor Detail Not Found",
      });
    }

    // CHECK given tag is valid or not
    const tagDetails = await Tags.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tag",
      });
    }

    // upload Image to Cloudinary
    const uploadedThumbnail = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      price,
      tag: tagDetails._id,
      thumbnail: uploadedThumbnail.secure_url,
      whatYouWillLearn: whatYouWillLearn,
    });

    // add the new course to the user schems of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // update the tag Schema
    // TODO HW

    // return response
    return res.status(201).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error while creating course",
      error: error.message,
      success: false,
    });
  }
};

// getAllCourses handler function

exports.showAllCourse = async (req, res) => {
  try {
    
    // get all courses from the database
    const allCourse = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All Courses Retrieved Successfully",
      data: allCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error while fetching courses",
      error: error.message,
      success: false,
    });
  }
};
