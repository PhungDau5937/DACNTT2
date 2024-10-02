const express = require("express");
const router = express.Router();
/////
const ExamSubmission = require("../models/ExamSubmission")
const ApprovedExam = require("../models/ApprovedExam")
const Exam = require('../models/Exam'); 
const User = require('../models/User'); 
const Class = require("../models/Class");


const headControllers = require("../controllers/headControllers.js");
const authMiddleware = require("../middlewares/authMiddleware");

const authController = require("../controllers/authController.js")


router.route("/profile").get(authMiddleware.authenticateJWT, authController.profile);
router.route("/login").post(authController.login);
router.route("/adduser").post(authMiddleware.authenticateJWT ,headControllers.adduser);

router.route("/blockusers").post(authMiddleware.authenticateJWT ,headControllers.blockusers);
router.route("/user/:id").put(authMiddleware.authenticateJWT ,headControllers.updateUser);
// router.route("/user/:id").get(authMiddleware.authenticateJWT ,headControllers.getUserById); //getUserById
router.route("/userpass/:id").get(headControllers.getUserPassById); //getUserById
// router.( protect, authorize('Head'), userController.updateUser);

router.route("/users").get(authMiddleware.authenticateJWT, headControllers.users);
// router.route("/grade").get(authMiddleware.authenticateJWT, headControllers.grade);
// router.route("/grade").get(authMiddleware.authenticateJWT, headControllers.classes);


router.route("/classes").get( headControllers.classes);
router.route("/schoolyears").get(headControllers.schoolyears);
router.route("/deleteschoolyear").delete(headControllers.deleteschoolyear);
router.route("/semesters").get(headControllers.semesters);
router.route("/updatesemesterdates").put(headControllers.updatesemesterdates);
router.route("/getsemestersbyschoolyear").get(headControllers.getsemestersbyschoolyear);
router.route("/deletesemester").delete(headControllers.deletesemester);


// router.route("/grade").get(headControllers.grade);
// GRADE && SEMESTER
router.route("/addschoolyear").post( headControllers.addschoolyear);
router.route("/addsemester").post( headControllers.addsemester);
router.route("/setsemestersactive/:id").put( headControllers.setsemestersactive);
router.route("/getactivesemesters").get(headControllers.getactivesemesters);
router.route("/addclass").post( headControllers.addclass);
router.route("/getclasses/:id").get( headControllers.getclasses); 
router.route("/updateclass").put(headControllers.updateclass);
router.route("/deleteclass").delete(headControllers.deleteclass);

//CLASS:ID
router.route('/class/:classId').get(headControllers.getclassdetails); 
router.route('/class/:classId/addteacher').post(headControllers.addteachertoclass); // Route để thêm giáo viên vào lớp học
router.route('/class/:classId/addstudent').post(headControllers.addstudenttoclass); // Route để thêm học sinh vào lớp học
router.route('/class/studentswithoutclass/:classId').get(headControllers.getstudentswithoutclass); // Route để lấy danh sách học sinh chưa có lớp học
router.route('/class/teacherswithoutclass/:classId').get(headControllers.getteacherswithoutclass); //Route để lấy danh sách giáo viên chưa có lớp học
router.route('/class/:classId/removestudent').delete(headControllers.deletecstudentfromclass);


//Exam reques
router.route('/getexamrequests/:semesterId').get(headControllers.getExamRequests);
// router.route('/examsubmissions/semester/:semesterId').get(headControllers.getExamsBySemester);


router.post('/examsubmissions', async (req, res) => {
  const { examID, semesterID, grade, examType, status, comments, isActive, examTime } = req.body;

  try {
    // Validate input
    if (!semesterID || !grade || !examType) {
      return res.status(400).json({ message: 'Semester ID, grade, and exam type are required' });
    }

    // Create a new exam submission document
    const newExamSubmission = new ExamSubmission({
      examID: examID || [],  // Default to an empty array if no examID is provided
      semesterID,
      grade,
      examType,
      // status: status || 'Pending',
      comments: comments || '', // Default to an empty string if no comments are provided
      isActive: isActive || false,
      examTime: examTime || null // Default to null if no examTime is provided
    });

    // Save the exam submission document to MongoDB
    await newExamSubmission.save();

    // Send success response
    res.status(201).json({ message: 'Exam submission added successfully', data: newExamSubmission });
  } catch (error) {
    console.error('Error adding exam submission:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message }); // Include the error message for debugging
  }
});


// Lấy danh sách exam submissions theo semesterId và grade (nếu có)
router.get('/examsubmissions/semester/:semesterId', async (req, res) => {
  const { semesterId } = req.params;
  const { grade } = req.query;

  try {
    if (!semesterId) {
      return res.status(400).json({ message: 'Semester ID is required' });
    }

    // Tạo bộ lọc dựa trên semesterId và grade (nếu có)
    const filter = { semesterID: semesterId };
    if (grade) {
      filter.grade = grade;
    }

    const exams = await ExamSubmission.find(filter);

    if (!exams.length) {
      return res.status(404).json({ message: 'No exam submissions found for the given semester ID' });
    }

    res.status(200).json(exams);
  } catch (error) {
    console.error('Error fetching exam submissions:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/setexampassword/:examId', async (req, res) => {
  const { examId } = req.params;
  const { password } = req.body;

  console.log(password)

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Tìm bài kiểm tra theo examId
    const exam = await ExamSubmission.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }


    exam.examPassword = password

    // Lưu thay đổi
    await exam.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating exam password:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.put('/removeexampassword/:examId', async (req, res) => {
  const { examId } = req.params;

  try {
    // Tìm bài kiểm tra theo examId
    const exam = await ExamSubmission.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Xóa mật khẩu
    exam.examPassword = "";

    // Lưu thay đổi
    await exam.save();

    res.status(200).json({ message: 'Password removed successfully' });
  } catch (error) {
    console.error('Error removing exam password:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/approvedexams/:examSubmissionId', async (req, res) => {
  try {
    const { examSubmissionId } = req.params;

    // Tìm các kỳ thi đã được phê duyệt
    const approvedExams = await ApprovedExam.find({ ExamSubmissionID: examSubmissionId }).exec();
    
    // Lấy thông tin giáo viên tương ứng từ trường teacherID
    const teacherIds = approvedExams.map(exam => exam.teacherID); // Sử dụng teacherID thay vì userId
    const teachers = await User.find({ _id: { $in: teacherIds } }).exec();
    
    // Tạo một map cho giáo viên để dễ tra cứu
    const teacherMap = teachers.reduce((acc, teacher) => {
      acc[teacher._id.toString()] = teacher; // Chuyển _id thành chuỗi để đồng bộ
      return acc;
    }, {});
    
    // Bổ sung thông tin giáo viên vào các kỳ thi đã được phê duyệt
    const examsWithTeacherInfo = approvedExams.map(exam => {
      const teacher = teacherMap[exam.teacherID.toString()]; // Lấy thông tin giáo viên
      return {
        ...exam.toObject(),
        teacher: {
          lastName: teacher?.lastName || 'N/A',
          firstName: teacher?.firstName || 'N/A',
          username: teacher?.username || 'N/A'
        }
      };
    });
    
    res.json(examsWithTeacherInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.put('/approvedexams/:examId', async (req, res) => {
  const { examId } = req.params;
  const { status } = req.body;

  try {
      // Validate status
      if (!['pending', 'approved', 'rejected'].includes(status)) {
          return res.status(400).json({ error: 'Invalid status' });
      }

      // Find and update the exam
      const updatedExam = await ApprovedExam.findByIdAndUpdate(
          examId,
          { status },
          { new: true } // Return the updated document
      );

      if (!updatedExam) {
          return res.status(404).json({ error: 'Exam not found' });
      }

      res.json(updatedExam);
  } catch (error) {
      console.error('Error updating exam status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});








// router.route('/getexamrequests/:semesterId').get(headControllers.getExamRequests);

// router.route('/getactivesemesters').get(headControllers.getActiveSemesters);
router.route('/setexamtime/:examId').put(headControllers.setExamTime);
router.route('/toggleexamstatus/:examId').put(headControllers.toggleExamStatus);






module.exports = router;
