const mongoose = require("mongoose");

const CourseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  completedVideo:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }
  ]
});

module.exports = mongoose.model("CourseProgress", CourseProgressSchema);
