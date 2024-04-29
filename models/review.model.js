import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    reviewId:{
        type: String,
        unique:true,
        required: true,
    },
    employeeId: {
        type: String,
        required: true,
    },
    reviewerEmployeeId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    feedback: {
        type: String,
        required: true,
        default: " ",
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        required: true,
        default: "Pending",
    },
});
const ReviewModel = mongoose.model("Review", ReviewSchema);
export default ReviewModel;