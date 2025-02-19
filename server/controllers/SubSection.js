const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// createSubSection Habdler Function...........................................................
exports.createSubSection = async (req, res) => {
  try {
    // fetch data
    const { sectonId, title, timeDuration, description } = req.body;

    // extract file and video
    const video = req.files.videoFiles;

    // validation
    if (!sectonId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields.",
      });
    }

    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create a sub-section
    const subsectionDetail = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // return response
    return res.status(201).json({
      success: true,
      message: "Sub-section created successfully.",
      data: subsectionDetail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error While creating Subsection : ${error.message}`,
    });
  }
};

// TODO: updateSubsection
// TODO: deleteSubsection
