// crud operation for employee(Add/remove/update/view employees) done
// Add/update/view performance reviews
// Assign employees to participate in another employee's performance review
import express from "express";
import AdminModel from "../../models/admin.model.js";
import EmployeeModel from "../../models/employee.model.js";
import ReviewModel from "../../models/review.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
const router = express.Router();

// admin login
router.post("/admin_login", async (req, res) => {
    // disable email typing
    const { password } = req.body;
    if (!password) {
        return res.status(400).send("All fields are required.");
    }
    try {
        const user = await AdminModel.findOne({ email: 'admin@gmail.com' });
        if (!user) {
            return res.status(401).send("Invalid email");
        }else if (password === user.password) {
            return res.status(200).json(user);
            
        }else{
            return res.status(401).send("Invalid password.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in.");
    }
})

router.post("/employee_login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("All fields are required.");
    }
  
    try {
      const user = await EmployeeModel.findOne({ email });
      if (!user) {
        return res.status(401).send("Invalid email");
      }
  
      // Compare password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send("Invalid password.");
      }
  
      // Login successful, send user data (consider security aspects)
      res.status(200).json(user);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).send("Error logging in.");
    }
  });

router.get("/get_employee_by_mail/:emailId", async (req, res) => {
    const {emailId} = req.params;
    try {
        const employee = await EmployeeModel.findOne({email: emailId});
        if(employee){
            return res.status(200).json(employee);
        }else{
            return res.status(404).send("Employee not found.");
        }
    } catch (error) {
        console.log(error);
    }
})
// create employee
router.post("/create_employee", async (req, res) => {
    const { name, email, department, designation } = req.body;
    const employeeId = crypto.randomBytes(4).toString("hex");
    const password = await bcrypt.hash(employeeId, 10);
    if (!name || !email || !password || !department || !designation) {
        return res.status(400).send("All fields are required.");
    }
    try {
        const user = await EmployeeModel.create({
            employeeId,
            name,
            email,
            password,
            department,
            designation,
            reviews: [],
        });
        console.log("User created:", user);
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user.");
    }
});
// get employee
router.get("/get_employee_id/:employeeId?", async (req, res) => {
    let employee;
    console.log('hello '+req.params.employeeId);
    if (req.params.employeeId) {
        employee = await EmployeeModel.findOne({ employeeId: req.params.employeeId });
    } else {
        employee = await EmployeeModel.find();
    }
    return res.status(200).json(employee);
});

// get all employees names

router.get("/get_employee_names", async (req, res) => {
    try {
        const employeeNames = await EmployeeModel.aggregate(
            [
                {
                  $project: {
                    _id: 0, // Exclude
                    name: 1, // Include
                  }
                }
              ]
        );
        return res.status(200).json(employeeNames);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching employee names' });
      }
})

// update employee
router.put("/update_employee/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;
        const updateData = req.body;
        let employee = await EmployeeModel.findOneAndUpdate(
            { employeeId }, updateData, { new: true });
        if (!employee) {
            return res.status(404).send("Employee not found.");
        }
        return res.status(201).json(employee);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Error updating employee.");
    }
});
// delete employee
router.delete("/delete_employee/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
    let employee = await EmployeeModel.findOneAndDelete({ employeeId });
    if (!employee) {
        return res.status(404).send("Employee not found.");
    }
    return res.status(200).send("Employee deleted successfully.");
});

// submit_review
router.post("/submit_review", async (req, res) => {
    const { employeeId, reviewerEmployeeId, rating, feedback } = req.body;
    const status = "Completed";
    const reviewId = crypto.randomBytes(4).toString("hex");
    if (!employeeId || !reviewerEmployeeId || !rating || !feedback) {
        return res.status(400).send("All fields are required.");
    }
    try {
        const review = await ReviewModel.create({
            reviewId,
            employeeId,
            reviewerEmployeeId,
            rating,
            feedback,
            status,
        });
        console.log("Review submitted:", review);
        res.status(201).json(review);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).send("Error creating review.");
    }
})
// get_review
router.get("/get_review_reviewId/:reviewId?", async (req, res) => {
    try {
        const { reviewId } = req.params;
        console.log(req.params);
        let review;
        if (reviewId) {
            review = await ReviewModel.findOne({ reviewId });
        } else {
            review = await ReviewModel.find();
        }
        return res.status(200).json(review);
    } catch (error) {
        console.log(error);
    }
})
router.get("/get_review_reviewerId/:reviewerId?", async (req, res) => {
    try {
        const { reviewerId } = req.params;
        console.log(reviewerId);
        let review;
        if (reviewerId) {
            review = await ReviewModel.find({ reviewerEmployeeId: reviewerId });
        } else {
            review = await ReviewModel.find();
        }
        return res.status(200).json(review);
    } catch (error) {
        console.log(error);
    }
})
router.get("/get_review_employeeId/:employeeId?", async (req, res) => {
    try {
        const { employeeId } = req.params;
        let review;
        if (employeeId) {
            review = await ReviewModel.find({ employeeId: employeeId });
        }
        else {
            review = await ReviewModel.find();
        }
        return res.status(200).json(review);
    } catch (error) {
        console.log(error);
    }
})
router.get("/get_review_reviewerId_employeeId/:reviewerId?/:employeeId?", async (req, res) => {
    try {
        const { reviewerId, employeeId } = req.params;
        let review;
        if (reviewerId && employeeId) {
            review = await ReviewModel.find({ reviewerEmployeeId: reviewerId, employeeId: employeeId });
        } else {
            review = await ReviewModel.find();
        }
        return res.status(200).json(review);
    } catch (error) {
        console.log(error);
    }
})
// update_review
router.put("/update_review/:reviewId", async (req, res) => {
    try {
        const { reviewId } = req.params;
        const updateData = req.body;
        let review = await ReviewModel.findOneAndUpdate(
            { reviewId }, updateData, { new: true });
        if (!review) {
            return res.status(404).send("Review not found.");
        }
        return res.status(201).json(review);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Error updating review.");
    }
})
// delete_review
router.delete("/delete_review/:reviewId", async (req, res) => {
    const { reviewId } = req.params;
    let review = await ReviewModel.findOneAndDelete({ reviewId });
    if (!review) {
        return res.status(404).send("Review not found.");
    }
    return res.status(200).send("Review deleted successfully.");
})
// create or assign review to employee
router.post("/assign_review", async (req, res) => {
    const { employeeId, reviewerEmployeeId } = req.body;
    const status = "Pending";
    const reviewId = crypto.randomBytes(4).toString("hex");
    if (!employeeId || !reviewerEmployeeId) {
        return res.status(400).send("All fields are required.");
    }
    try {
        const review = await ReviewModel.create({
            reviewId,
            employeeId,
            reviewerEmployeeId,
            status,
        });
        console.log("Review assigned:", review);
        res.status(201).json(review);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).send("Error creating review.");
    }
})

export default router;

