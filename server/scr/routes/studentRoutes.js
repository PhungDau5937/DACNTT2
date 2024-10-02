// studentRoutes.js
const express = require('express');
const router = express.Router();
const studentControllers = require('../controllers/studentControllers');
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController.js")

const Exam = require('../models/Exam');
const ApprovedExam = require('../models/ApprovedExam');
const Score = require('../models/Score');

// router.route("/login").post(studentControllers.login);
router.route("/login").post(authController.login);
// router.route("/users", authMiddleware.authenticateJWT).get(studentControllers.users);


router.get('/publicexams', async (req, res) => {
  try {
    const exams = await Exam.find({ status: 'public' });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/publicexams/:examID', async (req, res) => {
  try {
    const { examID } = req.params; // Lấy examID từ URL parameters
    const exam = await Exam.findById(examID); // Tìm exam theo examID

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' }); // Xử lý khi không tìm thấy exam
    }

    res.json(exam); // Trả về exam nếu tìm thấy
  } catch (error) {
    res.status(500).json({ message: error.message }); // Xử lý lỗi server
  }
});


router.route("/getactivesemesters").get(studentControllers.getactivesemesters);


router.route("/examsubmissions/semester/:semesterId").get(studentControllers.getexamsubmissionsbystudentid);

router.get('/approvedexams/:examID', async (req, res) => {
  try {
    const { examID } = req.params; // Lấy examID từ URL parameters
    const exam = await ApprovedExam.findById(examID); // Tìm exam theo examID

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' }); // Xử lý khi không tìm thấy exam
    }

    res.json(exam); // Trả về exam nếu tìm thấy
  } catch (error) {
    res.status(500).json({ message: error.message }); // Xử lý lỗi server
  }
});

router.get('/approvedexams/:studentId/:submissionId', async (req, res) => {
  const { studentId, submissionId } = req.params;
  console.log("submissionId: ", submissionId);

  try {
    // Tìm kiếm bài kiểm tra đã được phê duyệt dựa trên studentId và ExamSubmissionID
    const approvedExam = await ApprovedExam.find({
      // studentId: studentId,
      ExamSubmissionID: submissionId,
      status: "approved"
    });

    if (!approvedExam) {
      // Nếu không tìm thấy bài kiểm tra nào, trả về thông báo không tìm thấy
      return res.status(404).json({ message: 'Approved exam not found' });
    }

    // Trả về bài kiểm tra đã được phê duyệt dưới dạng JSON
    res.json(approvedExam);
    console.log(approvedExam);
  } catch (error) {
    // Xử lý lỗi và gửi phản hồi lỗi
    console.error('Error fetching approved exam:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.route('/submitexam/:studentId').put(studentControllers.submitExamResult);


router.route("/getclasses/:studentId").get(studentControllers.getclasses);  
router.route('/getscores/:studentId/:classId').get(studentControllers.getScores);

module.exports = router;
