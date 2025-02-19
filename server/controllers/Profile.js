const Profile = require("../models/Profile");
const User = require("../models/User");

// update Profile
// as we have already created the profile in the Auth controller (signup controller as additional details), we are just updating it here
exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // get userId
    const id = req.user.id;

    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        message: "Please fill all the fields",
        status: false,
      });
    }

    // find Profile
    const userDetails = await User.findById(id);

    // get id of profile via additionalDetails from user
    const profileId = userDetails.additionDetail;

    // get the profileDetails using profileId
    const profileDetails = await Profile.findById(profileId);

    // Update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    // save the profile
    await profileDetails.save();

    // return response
    return res.status(200).json({
      message: "Profile updated successfully",
      status: true,
      profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// deleteAccount handler
exports.deleteAccount = async (req, res) => {
  try {
    // get userId
    const id = req.user.id;
    // find User
    const userDetails = await User.findById(id);
    // validation
    if (!userDetails) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionDetail });
    // Todo unenroll user from all enrolled Course
    // delete user
    // what is cronejob
    // how can we schedule this deletion operation
    await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      message: "Account deleted successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "user NOT deleted",
      status: false,
    });
  }
};

// get user detail
exports.getUserDetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetail")
      .exec();

    // return response
    return res.status(200).json({
      message: "User details fetched successfully",
      status: true,
      userDetails: userDetails,
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching user details",
      status: false,
    });
  }
};
