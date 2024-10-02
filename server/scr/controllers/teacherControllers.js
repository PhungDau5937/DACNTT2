const User = require("../models/User");
const SchoolYear = require("../models/SchoolYear");
const Class = require("../models/Class");
const Semester = require("../models/Semester");
const ExamSubmission = require("../models/ExamSubmission");
const ApprovedExam = require("../models/ApprovedExam");
const Exam = require("../models/Exam");
const Score = require("../models/Score");


const mongoose = require('mongoose');



exports.getClasses = async (req, res) => {
  try {
    const { teacherId, semesterId } = req.query; // Lấy ID từ query parameters

    // Tìm các lớp học mà giáo viên dạy trong học kỳ
    const classes = await Class.find({ teacher: teacherId, semester: semesterId })
      .populate('teacher') // Điền thông tin giáo viên
      .exec();

    res.json(classes);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lớp học và giáo viên:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách lớp học và giáo viên." });
  }
};

// Hàm lấy danh sách học kỳ
exports.getSemesters = async (req, res) => {
  try {
    const teacherId = req.query.teacherId; // Lấy ID từ query parameters

    const classes = await Class.find({ teacher: teacherId }).populate('semester');
    const semesters = [...new Set(classes.map(c => c.semester))];

    res.json(semesters);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học kỳ cho giáo viên:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách học kỳ cho giáo viên." });
  }
};

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


exports.getexamsubmissionsbyteacherid = async (req, res, next) => {
  try {
    const { semesterId } = req.params;
    const { teacherId } = req.query;

    if (!semesterId || !teacherId) {
      return res.status(400).json({ message: 'Semester ID and Teacher ID are required.' });
    }

    // Tìm tất cả các lớp của teacherId trong semesterId
    const classes = await Class.find({
      semester: semesterId,
      teacher: teacherId
    }).select('grade'); // Chọn chỉ trường grade

    if (classes.length === 0) {
      return res.status(404).json({ message: 'No classes found for the given teacher in the specified semester.' });
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



exports.putexamsubmit = async (req, res) => {
  const { examId } = req.params; // ID của kỳ thi
  const { teacherId, semesterId, grade, submissionId, examType } = req.body; // Thông tin bài nộp kỳ thi
  console.log('teacherId', teacherId);
  console.log('semesterId', semesterId);
  console.log('grade', grade);
  console.log('submissionId', submissionId);
  console.log('examType', examType);

  try {
    // Fetch the Exam document
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Fetch the ExamSubmission document based on submissionId
    const examSubmission = await ExamSubmission.findById(submissionId);
    if (!examSubmission) {
      return res.status(404).json({ message: 'ExamSubmission not found' });
    }

    // Ensure examSubmission matches the criteria (i.e., correct semester, grade)
    if (examSubmission.semesterID.toString() !== semesterId || examSubmission.grade !== grade) {
      return res.status(400).json({ message: 'ExamSubmission does not match the criteria' });
    }

    // Find and delete any existing ApprovedExam with the same teacherID, examType, and ExamSubmissionID if it exists
    let existingApprovedExams = await ApprovedExam.find({
      teacherID: teacherId,
      examType: examType,
      ExamSubmissionID: submissionId
    });

    // Delete all existing ApprovedExam documents found
    if (existingApprovedExams.length > 0) {
      await ApprovedExam.deleteMany({
        teacherID: teacherId,
        examType: examType,
        ExamSubmissionID: submissionId
      });
    }

    // Create a new ApprovedExam document
    const newApprovedExam = new ApprovedExam({
      examID: exam._id,
      ExamSubmissionID: submissionId,
      titleExam: exam.titleExam,
      status: 'pending',
      classExam: exam.classExam,
      time: exam.time,
      score: exam.score,
      description: exam.description,
      chapters: exam.chapters,
      teacherID: teacherId,
      examType: examType,
      approvalDate: Date.now()
    });

    // Save the new ApprovedExam document
    await newApprovedExam.save();

    // Optionally update ExamSubmission status to 'submitted' or similar
    examSubmission.status = 'submitted'; // Adjust status if needed
    await examSubmission.save();

    res.status(200).json({ message: 'Exam submitted successfully', approvedExam: newApprovedExam });
  } catch (error) {
    console.error('Error submitting exam:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};




exports.users = async (req, res) => {
  const users = await User.find().select('-password'); // Không trả về mật khẩu
  res.json(users);
};


//Classses

exports.getclasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.params.teacherId })
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


///// Nhập điểm

// Lấy thông tin chi tiết lớp học



exports.getClassesById = async (req, res) => {
  const { classId } = req.params;

  try {
    // Tìm lớp học theo classId
    const classDetails = await Class.findById(classId)
      .populate({
        path: 'teacher',
        select: 'firstName lastName'
      }) // Lấy thông tin giáo viên
      .populate({
        path: 'students',
        select: 'firstName lastName username' // Chỉ lấy firstName, lastName và email của sinh viên
      })// Lấy thông tin sinh viên
      .populate({
        path: 'semester',
        populate: {
          path: 'schoolYear',
          select: 'year'
        }
      }); // Lấy thông tin học kỳ và năm học

    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch class details' });
  }
};

exports.saveScores = async (req, res) => {
  const { classId } = req.params;
  const { students } = req.body;

  try {
    if (!classId) {
      return res.status(400).json({ message: 'Class ID is required' });
    }

    const classDetails = await Class.findById(classId);
    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const scoreUpdates = students.map(async (student) => {
      if (!student || !student._id) {
        console.error('Invalid student data:', student);
        return null;
      }

      let score = await Score.findOne({
        studentId: student._id,
        classId: classId
      });

      if (!score) {
        score = new Score({
          studentId: student._id,
          classId: classId,
        });
      }

      // Đảm bảo rằng các điểm được truyền vào đúng định dạng
      score.scores.oral = (student.oralScores || []).slice(0, 3);
      score.scores.fifteenMinutes = (student.fifteenMinuteScores || []).slice(0, 3);
      score.scores.midTerm = student.fortyFiveMinuteScore || null;
      score.scores.finalExam = student.finalScore || null;

      // Tính toán điểm trung bình
      const calculateAverageScore = () => {
        const { oral, fifteenMinutes, midTerm, finalExam } = score.scores;

        const oralScores = oral.filter(score => score !== null);
        const fifteenMinuteScores = fifteenMinutes.filter(score => score !== null);

        // Tổng điểm và tổng hệ số
        let totalScore = 0;
        let totalWeight = 0;

        // Tính tổng điểm và hệ số cho điểm miệng
        oralScores.forEach(score => {
          totalScore += score;
          totalWeight += 1;
        });

        // Tính tổng điểm và hệ số cho điểm 15 phút
        fifteenMinuteScores.forEach(score => {
          totalScore += score;
          totalWeight += 1;
        });

        // Tính điểm giữa kỳ với hệ số 2
        if (midTerm !== null) {
          totalScore += midTerm * 2;
          totalWeight += 2;
        }

        // Tính điểm cuối kỳ với hệ số 3
        if (finalExam !== null) {
          totalScore += finalExam * 3;
          totalWeight += 3;
        }

        // Trả về điểm trung bình
        return totalWeight > 0 ? totalScore / totalWeight : 0;
      };

      score.averageScore = calculateAverageScore();

      try {
        return await score.save();
      } catch (validationError) {
        console.error('Validation error for student:', student._id, validationError);
        return null;
      }
    });

    const savedScores = await Promise.all(scoreUpdates);
    const validSavedScores = savedScores.filter(score => score !== null);

    res.json({
      message: 'Scores saved successfully',
      savedCount: validSavedScores.length,
      totalCount: students.length
    });
  } catch (error) {
    console.error('Error in saveScores:', error);
    res.status(500).json({ message: 'Failed to save scores', error: error.message });
  }
};

exports.getScores = async (req, res) => {
  try {
    const { classId } = req.params;

    // Lấy thông tin lớp học để xác nhận lớp học tồn tại
    const classData = await Class.findById(classId).populate('students');
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Lấy thông tin học sinh từ bảng User có role là Student
    const students = await User.find({ _id: { $in: classData.students }, role: 'Student' });
    if (!students.length) {
      return res.status(404).json({ message: 'No students found for this class' });
    }

    // Lấy thông tin điểm của các học sinh trong lớp học
    const scores = await Score.find({ classId }).populate('studentId');

    // Tạo một object chứa thông tin điểm của từng học sinh
    const studentScores = students.map(student => {
      const studentScore = scores.find(score => score.studentId.equals(student._id));
      return {
        studentId: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        scores: studentScore ? {
          oral: studentScore.scores.oral || [null, null, null],
          fifteenMinutes: studentScore.scores.fifteenMinutes || [null, null, null],
          midTerm: studentScore.scores.midTerm || null,
          finalExam: studentScore.scores.finalExam || null,
          averageScore: studentScore.averageScore || null
        } : {
          oral: [null, null, null],
          fifteenMinutes: [null, null, null],
          midTerm: null,
          finalExam: null,
          averageScore: null
        }
      };
    });

    res.json({ classId, students: studentScores });
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ message: 'Server error' });
  }
};