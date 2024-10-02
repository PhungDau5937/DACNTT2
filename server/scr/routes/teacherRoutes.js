const express = require('express');
const router = express.Router();
const teacherControllers =  require("../controllers/teacherControllers.js");
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController.js")

//Phung
const Exam = require("../models/Exam");
const ApprovedExam = require("../models/ApprovedExam");
const Score = require("../models/Score");
const User = require("../models/User");
const mongoose = require("mongoose");


// router.route("/login").post(teacherControllers.login);
router.route("/login").post(authController.login);
router.route("/users", authMiddleware.authenticateJWT).get(teacherControllers.users);

router.route("/semesters").get(teacherControllers.getSemesters);
router.route("/classes").get(teacherControllers.getClasses);


//Quản lý nộp đề thi
router.route("/getactivesemesters").get(teacherControllers.getactivesemesters);

router.route("/examsubmissions/semester/:semesterId").get(teacherControllers.getexamsubmissionsbyteacherid);

router.route("/exam/:examId/submit").put(teacherControllers.putexamsubmit);

router.get('/approvedexams/:teacherId/:submissionId', async (req, res) => {
  const { teacherId, submissionId } = req.params;

  try {
    // Tìm kiếm bài kiểm tra đã được phê duyệt dựa trên teacherId và ExamSubmissionID
    const approvedExam = await ApprovedExam.findOne({
      teacherID: teacherId,
      ExamSubmissionID: submissionId
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


//Quản lý nộp đề thi

router.post("/createexam", async (req, res) => {
  try {
    const { teacherID, ...examData } = req.body;

    // Kiểm tra xem teacherID có tồn tại trong User collection
    const user = await User.findById(teacherID);
    if (!user) {
      return res.status(400).send({ success: false, message: "Invalid teacher ID" });
    }

    // Tạo đối tượng exam với teacherID được liên kết
    const exam = new Exam({
      ...examData,
      teacherID: teacherID // Gán teacherID từ body
    });

    await exam.save();

    res.send({ success: true, message: "Data saved successfully!", data: exam });
  } catch (error) {
    console.error("Error saving exam data:", error);
    res.status(500).send({ success: false, message: "Error saving data" });
  }
});
  
// update data
router.put("/update", async (req, res) => {
  /* console.log(req.body); */
  
  const { _id, ...rest } = req.body;
  const dataUpdate = await Exam.updateOne({ _id: _id }, rest);
  

  res.send({
    success: true,
    message: "data update successfully!",
    dataUpdate: dataUpdate,
  });
});

// delete data
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const dataDelete = await Exam.deleteOne({ _id: id });

  console.log(id);
  res.send({
    success: true,
    message: "data delete successfully!",
    dataDelete: dataDelete,
  });
});



router.get('/exam', async (req, res) => {
  try {
    // Lấy teacherID từ query parameters
    const teacherID = req.query.teacherID;

    if (!teacherID) {
      return res.status(400).json({ message: "Teacher ID is required" });
    }

    // Tìm các bài thi theo teacherID
    const exams = await Exam.find({ teacherID: teacherID });

    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get exam by ID
router.get('/exam/:id', getExam, (req, res) => {
  res.json(res.exam);
});

// Middleware to get exam by ID
async function getExam(req, res, next) {
  let exam;
  try {
    exam = await Exam.findById(req.params.id);
    if (exam == null) {
      return res.status(404).json({ message: 'Cannot find exam' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.exam = exam;
  next();
}


router.put('/updateexamstatus/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['public', 'private'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    // Cập nhật exam với id tương ứng
    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(updatedExam);
  } catch (error) {
    console.error("Error updating exam status:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


/////////////////////////////// Nhập điểm
// router.get('/scores', getScoresByClass);
router.route("/getclasses/:teacherId").get(teacherControllers.getclasses);
router.route("/getscores/:classId").get(teacherControllers.getScores);
// router.('//:', );


router.route("/getclassdetails/:classId").get(teacherControllers.getClassesById);
router.route("/savescore/:classId").post(teacherControllers.saveScores);
// router.route("/getscore/:classId").post(teacherControllers.getScore);
// router.route("/classes").get(teacherControllers.getClasses);


router.get('/class/:classId', async (req, res) => {
  try {
    const scores = await Score.find({ classId: req.params.classId });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật điểm số
router.put('/update/:id', async (req, res) => {
  try {
    const score = await Score.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//test

const Question = require("../models/QuestionRandom.js");


// Random question
// Get random questions
router.get('/questions/random', async (req, res) => {
  try {
    const { quantity, type, level } = req.query; // ok


    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const numQuestions = parseInt(quantity);

    // Build the query to fetch questions
    let query = { type };
    if (level && level !== 'random') {
      query.level = level;
    } //ok


    console.log(typeof(query));


    // Fetch all questions of the specified type (and level, if provided)
    const allQuestions = await Question.find(query);
    console.log(allQuestions);

    if (allQuestions.length < numQuestions) {
      return res.status(404).json({ message: 'Not enough questions available.......' });
    }

    // Function to get a random subset of an array
    const getRandomSubset = (arr, num) => {
      const shuffled = arr.slice().sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    };

    let filteredQuestions = allQuestions;

    if (level === 'random') {
      // Randomly pick questions from each difficulty
      const difficulties = ['Dễ', 'Trung bình', 'Khó'];
      const questionsByDifficulty = difficulties.map(difficulty => 
        allQuestions.filter(question => question.level === difficulty)
      );

      const numPerDifficulty = Math.ceil(numQuestions / difficulties.length);

      // Get random questions from each difficulty
      const randomQuestions = questionsByDifficulty.flatMap(qs => getRandomSubset(qs, numPerDifficulty));

      // Shuffle the combined results and limit to the required number
      filteredQuestions = getRandomSubset(randomQuestions, numQuestions);
    } else {
      // If not random, just get a random subset
      filteredQuestions = getRandomSubset(allQuestions, numQuestions);
    }

    res.json(filteredQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});







module.exports = router;
