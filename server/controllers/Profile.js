const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

 

  
// update Profile
// as we have already created the profile in the Auth controller (signup controller as additional details), we are just updating it here
// exports.updateProfile = async (req, res) => {
//   try {
//     // get data
//     const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

//     // get userId
//     const id = req.user.id;

//     // validation
//     if (!contactNumber || !gender || !id) {
//       return res.status(400).json({
//         message: "Please fill all the fields",
//         status: false,
//       });
//     }

//     // find Profile
//     const userDetails = await User.findById(id)
//     console.log("User Details:", userDetails);


//     if (!userDetails) {
//       return res.status(404).json({
//         message: "User not found",
//         status: false,
//       });
//     }
//     // get id of profile via additionalDetails from user
//     const profileId = userDetails.additionalDetails;
    

//     console.log("profileId", profileId);

//     if (!profileId) {
//       return res.status(404).json({
//         message: "Profile not found",
//         status: false,
//       });
//     }

    

//     // get the profileDetails using profileId
//     const profileDetails = await Profile.findById(profileId);
//     console.log("profileDetails", profileDetails);

//     // Update profile
//     profileDetails.dateOfBirth = dateOfBirth;
//     profileDetails.about = about;
//     profileDetails.contactNumber = contactNumber;
//     profileDetails.gender = gender;
//     // save the profile
//     await profileDetails.save();

//     // return response
//     return res.status(200).json({
//       message: "Profile updated successfully",
//       status: true,
//       profileDetails,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: `ProfileUpdate Error: ${error.message}`,
//       status: false,
//     });
//   }
// };

// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber,  gender,firstName, lastName  } = req.body;
    const id = req.user.id;
    console.log("Received in req.body:", req.body);

    // Validation
  
    // Find the profile by id
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(userDetails);
    // Get the profile using additionalDetails from user
    const profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
      }
    console.log(profile);
    

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;
    userDetails.firstName = firstName;
    userDetails.lastName = lastName;



    // Save the updated profile
    await profile.save();
    await userDetails.save();

    return res.json({
      success: true,
      message: "Profile updated successfully!!",
      profile,
      userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
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
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
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
exports.getAllUserDetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
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

//updateDisplayPicture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:`Error : ${error.message}`,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec();
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
