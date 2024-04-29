import mongoose from "mongoose";
import ReviewModel from "./review.model.js";

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique:true,
        required:true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique:true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    pendingReviews: {
        type: Number,
        default: 0
    },
    completedReviews: {
        type: Number,
        default: 0
    },
    assignedReviews: {
        type: Number,
        default: 0
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

const EmployeeModel = mongoose.model("Employee", employeeSchema);
export default EmployeeModel;