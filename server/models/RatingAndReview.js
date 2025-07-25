const mongoose = require("mongoose");

const RatingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: "true",
  },
  course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},
});

module.exports = mongoose.model("RatingAndReview", RatingAndReviewSchema);
