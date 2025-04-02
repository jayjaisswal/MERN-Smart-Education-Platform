const Section = require("../models/Section");
const Course = require("../models/Course");

// create section handler......................................................................
// CREATE a new section
exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body;

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName });

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// updatesection section handler.................................................................

exports.updateSection = async (req, res) => {
  try {
    // fetch Data
    const { sectionId, sectionName } = req.body;
    // validate Data
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Section updated Successfully",
      UpdateSection: section,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `${error.message},while Upating Section`,
    });
  }
};

// deteteSection handler function ....................................................................
exports.deleteSection = async (req, res) => {
  try {
    // get ID - assuming that we are sending ID in params
    const { sectionId } = req.params;
    // use findByIdAndDelete
    const section = await Section.findByIdAndDelete(sectionId);
    // TODO: Do we need to delete the entry from course schema?
    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted Successfully",
      deletedSection: section,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `${error.message},while deleting Section`,
    });
  }
};
