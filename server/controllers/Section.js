const Section = require("../models/Section");
const Course = require("../models/Course");

// create section handler......................................................................
exports.createSection = async (req, res) => {
  try {
    // fetch Data
    const { sectionName, courseId } = req.body;
    // validate Data
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    // create Section
    const newSection = await Section.create({
      sectionName,
    });
    // Update Course with Section ObjectId
    const updatedCourseDetail = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          sections: newSection._id,
        },
      },
      { new: true }
    );

    // TODO: use Populate to replace section and sub-section both in the UpdatedCourseDetails
    // return Response
    return res.status(200).json({
      success: true,
      message: "Section created Successfully",
      updatedCourseDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `${error.message},while creating Section`,
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
