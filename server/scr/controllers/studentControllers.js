const express = require("express");
const router = express.Router();
const User = require("../models/User");
const SchoolYear = require("../models/SchoolYear");
const Class = require("../models/Class");
const Semester = require("../models/Semester");
const ExamSubmission = require("../models/ExamSubmission");
const ApprovedExam = require("../models/ApprovedExam");
const Exam = require("../models/Exam");
const Score = require("../models/Score");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret_jwt = process.env.SECRET_JWT;


exports.getactivesemesters = async (req, res, next) => {
  try {
    // Populate semesters with their corresponding SchoolYear data (including year)
    const activeSemesters = await Semester.find({ isActive: true })
      .populate({
        path: "schoolYear",
        select: "year", // Only select the 'year' field from SchoolYear
      })
      .exec();

    // Extract and format the school year for each active semester
    const formattedSemesters = activeSemesters.map((semester) => {
      return {
        ...semester.toObject(), // Include all semester data
        schoolYear: semester.schoolYear ? semester.schoolYear.year : null, // Handle potential null SchoolYear
      };
    });

    res.json(formattedSemesters);
  } catch (error) {
    next(error);
  }
};

exports.getexamsubmissionsbystudentid = async (req, res, next) => {
  try {
    const { semesterId } = req.params;
    const { studentId } = req.query;

    if (!semesterId || !studentId) {
      return res.status(400).json({ message: 'Semester ID and student ID are required.' });
    }

    // Tìm tất cả các lớp của studentId trong semesterId
    const classes = await Class.find({
      semester: semesterId,
      students: studentId
    }).select('grade'); // Chọn chỉ trường grade

    if (classes.length === 0) {
      return res.status(404).json({ message: 'No classes found for the given student in the specified semester.' });
    }

    const grades = classes.map(cls => cls.grade);

    // Tìm tất cả exam submissions cho các lớp với grade tương ứng
    const examSubmissions = await ExamSubmission.find({
      semesterID: semesterId,
      grade: { $in: grades }
    }).populate('examID'); // Nếu bạn muốn thông tin chi tiết về exam


    res.status(200).json(examSubmissions);
  } catch (error) {
    next(error);
  }
};


exports.submitExamResult = async (req, res) => {
  const { approvedExamID, submissionId, scoreData } = req.body;
  const { studentId } = req.params;

  try {
    // Tìm ApprovedExam để xác định loại thi và lấy classId
    const approvedExam = await ApprovedExam.findById(approvedExamID);
    if (!approvedExam) {
      return res.status(404).json({ message: 'ApprovedExam not found' });
    }
    const classIdFromApprovedExam = approvedExam.classId;

    // Tìm ExamSubmission tương ứng và lấy classId
    const examSubmission = await ExamSubmission.findById(submissionId);
    if (!examSubmission) {
      return res.status(404).json({ message: 'ExamSubmission not found' });
    }
    const classIdFromExamSubmission = examSubmission.classId;

    // Tìm Class mà studentId thuộc về
    const studentClass = await Class.findOne({ students: studentId });
    if (!studentClass) {
      return res.status(404).json({ message: 'Class for student not found' });
    }
    const classIdFromStudent = studentClass._id;

    // Xác định classId chính xác
    const classId = classIdFromApprovedExam || classIdFromExamSubmission || classIdFromStudent;

    // Cập nhật điểm của sinh viên
    const scoreUpdate = {
      ...scoreData,
    };

    // Lưu điểm vào mô hình Score
    let scoreRecord = await Score.findOne({ studentId: studentId, classId: classId });
    if (!scoreRecord) {
      scoreRecord = new Score({ studentId, classId: classId, scores: scoreUpdate });
    } else {
      scoreRecord.scores = { ...scoreRecord.scores, ...scoreUpdate };
    }
    await scoreRecord.save();

    res.status(200).json({ message: 'Exam result submitted and score updated successfully.' });
  } catch (error) {
    console.error('Error submitting exam result:', error);
    res.status(500).json({ message: 'Error submitting exam result', error: error.message });
  }
};

exports.getclasses = async (req, res) => {
  try {
    const classes = await Class.find({ students: req.params.studentId })
      .populate({
        path: 'semester',
        populate: {
          path: 'schoolYear'
        }
      })
      .populate({
        path: 'teacher',
        select: 'firstName lastName'
      })
      .populate({
        path: 'students',
        select: '-password' // Loại trừ trường password
      });
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Error fetching classes' });
  }
};
exports.getScores = async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    console.log(studentId, classId);

    // Tìm lớp học theo classId
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Tìm điểm của học sinh trong lớp học
    const scores = await Score.findOne({ classId: classId, studentId: studentId });

    console.log(scores)
    if (!scores) {
      return res.status(404).json({ message: 'Scores not found for this student in the class' });
    }

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};