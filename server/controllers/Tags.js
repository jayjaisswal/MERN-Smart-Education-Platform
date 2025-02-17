const Tags = require("../models/Tags");

// create Tag handler function

exports.createTag = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;
    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }

    // create entry in db
    const tagDetails = await Tags.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in Tag handler function",
    });
  }
};

// getAlltags handler function

exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tags.find({}, { name: true, description: true });
    return res.ststus(200).json({
      success: true,
      message: "All tags returned Successfully",
      allTags: allTags,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong in getAlltags handler function :${error.message}`,
    });
  }
};
