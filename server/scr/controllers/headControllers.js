const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const SchoolYear = require("../models/SchoolYear");
const Class = require("../models/Class");
const Semester = require("../models/Semester");
const ExamSubmission = require("../models/ExamSubmission")
const Exam = require("../models/Exam")
// const crypto = require('crypto');
// const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

function getRandomAvatar() {
  const avatarsDir = path.join(__dirname, '..', '..', 'uploads', 'images', 'randomAvata');
  const files = fs.readdirSync(avatarsDir);
  const avatars = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return `uploads/images/randomAvata/${avatars[randomIndex]}`;
}
exports.adduser = async (req, res) => {
  const { email, firstName, lastName, address, contactNumber, role } = req.body;

  // Chuyển đổi address về dạng chuỗi nếu cần
  const addressString = typeof address === 'string' ? address : '';

  if (email !== "") {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
  }

  async function generateUserId(role) {
    const currentYear = new Date().getFullYear().toString();
    let userId;
    let existingUser;

    const existingUserIds = await User.find({ role })
      .select("username")
      .sort({ username: 1 })
      .lean();

    const prefixMap = {
      Student: "1",
      Teacher: "T",
      Head: "H",
    };

    const prefix = prefixMap[role];

    for (let i = 1; i <= existingUserIds.length + 1; i++) {
      userId = `${prefix}${currentYear}${i.toString().padStart(4, "0")}`;
      existingUser = existingUserIds.find((user) => user.username === userId);
      if (!existingUser) {
        return userId;
      }
    }

    return userId;
  }

  try {
    let password = crypto.randomBytes(6).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let username = await generateUserId(role);
    let avatar = getRandomAvatar();

    const newUser = new User({
      username,
      email,
      firstName,
      lastName,
      address: addressString, // Sử dụng addressString đã chuyển đổi
      contactNumber,
      role,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.users = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
};

exports.getUserPassById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("passwordChanged");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.passwordChanged === false) {
      // Generate a new temporary password with guaranteed 6 characters
      let tempPassword;
      do {
        tempPassword = crypto.randomBytes(3).toString("hex"); // Generate 6 bytes (12 hex characters)
      } while (tempPassword.length !== 6); // Repeat if not exactly 6 characters

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      // Update user's password in the database
      user.password = hashedPassword;
      await user.save();

      // Send the temporary password to the client
      res.json({
        message: "Temporary password generated",
        tempPassword, // Send the generated tempPassword
        instruction: "Please change this password immediately after logging in."
      });
    } else {
      // If password has been changed, instruct user to use reset function
      res.json({
        message: "Password has been previously set",
        instruction: "Please use the 'Forgot Password' feature to reset your password if needed."
      });
    }
  } catch (error) {
    console.error("Error processing user password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.blockusers = async (req, res) => {
  const { userIds } = req.body;

  try {
    // Cập nhật trạng thái của các người dùng
    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { status: 'locked' } }
    );
    res.status(200).json({ message: 'Users blocked successfully' });
  } catch (error) {
    console.error('Error blocking users:', error);
    res.status(500).json({ message: 'Error blocking users' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.schoolyears = async (req, res) => {
  try {
    const schoolyears = await SchoolYear.find({}).sort({ year: -1 }).select("");
    res.json(schoolyears);
  } catch (error) {
    res.status(500).json({ error: "Error fetching school years" });
  }
};

exports.addschoolyear = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ error: "Invalid or missing year format." });
    }

    // Kiểm tra định dạng năm học
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!year || !yearPattern.test(year)) {
      return res.status(400).json({
        error: "Invalid or missing year format. Expected format: YYYY-YYYY",
      });
    }

    const existingYear = await SchoolYear.findOne({ year });
    if (existingYear) {
      return res.status(400).json({ error: "School year already exists." });
    }

    const newSchoolYear = new SchoolYear({
      // Changed 'addschoolyear' to 'newSchoolYear' (more descriptive)
      year: year,
      semesters: [],
    });

    const savedSchoolYear = await newSchoolYear.save();

    res.status(201).json(savedSchoolYear);
  } catch (error) {
    console.error("Error adding school year:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteschoolyear = async (req, res) => {
  try {
    const { id } = req.body; // Sử dụng req.body để lấy ID của niên khóa từ yêu cầu

    // Kiểm tra xem có tồn tại niên khóa với ID được cung cấp hay không
    const schoolYear = await SchoolYear.findById(id);

    if (!schoolYear) {
      return res.status(404).json({ error: "School year not found." });
    }

    // Kiểm tra xem học kỳ trong niên khóa có trống hay không
    if (schoolYear.semesters.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete school year with existing semesters." });
    }

    // Xóa niên khóa
    await SchoolYear.findByIdAndDelete(id);

    res.status(200).json({ message: "School year deleted successfully." });
  } catch (error) {
    console.error("Error deleting school year:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.semesters = async (req, res) => {
  const semesters = await Semester.find({}).select("");
  res.json(semesters);
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

exports.getsemestersbyschoolyear = async (req, res) => {
  try {
    const { schoolYearId } = req.query;
    if (!schoolYearId) {
      return res.status(400).json({ error: "Missing schoolYearId" });
    }

    const semesters = await Semester.find({ schoolYear: schoolYearId }).sort({
      name: 1,
    });
    res.status(200).json(semesters);
  } catch (error) {
    console.error("Error fetching semesters:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addsemester = async (req, res) => {
  try {
    const { name, startDate, endDate, schoolYearId } = req.body;

    // Kiểm tra năm học có tồn tại không
    const existingSchoolYear = await SchoolYear.findById(schoolYearId);
    if (!existingSchoolYear) {
      return res.status(404).json({ error: "School year not found." });
    }

    if (!schoolYearId) {
      console.log("'School year not found.'");
    }

    // Kiểm tra học kỳ đã tồn tại chưa
    const existingSemester = await Semester.findOne({
      name,
      schoolYear: schoolYearId,
    });
    if (existingSemester) {
      return res
        .status(400)
        .json({ error: "Semester already exists for this school year." });
    }

    // Tạo học kỳ mới
    const newSemester = new Semester({
      name,
      startDate,
      endDate,
      schoolYear: schoolYearId,
    });

    // Lưu học kỳ vào CSDL
    const savedSemester = await newSemester.save();

    // Thêm học kỳ vào danh sách semesters của năm học tương ứng
    existingSchoolYear.semesters.push(savedSemester._id);
    await existingSchoolYear.save();

    res.status(201).json(savedSemester);
  } catch (error) {
    console.error("Error adding semester:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatesemesterdates = async (req, res) => {
  // const { id } = req.params;
  const { id, startDate, endDate } = req.body;

  try {
    const semester = await Semester.findById(id);
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    semester.startDate = startDate;
    semester.endDate = endDate;

    await semester.save();
    res
      .status(200)
      .json({ message: "Semester dates updated successfully", semester });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deletesemester = async (req, res) => {
  const { id } = req.body;

  try {
    // Find the semester by id and delete it
    const deletedSemester = await Semester.findByIdAndDelete(id);

    if (!deletedSemester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    // Find the school year containing this semester
    const schoolYear = await SchoolYear.findOne({ semesters: id });

    if (!schoolYear) {
      return res.status(404).json({ error: "School year not found" });
    }

    // Remove the semester from the semesters array of the school year
    schoolYear.semesters.pull(id);
    await schoolYear.save();

    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    console.error("Error deleting semester:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the semester" });
  }
};

exports.setsemestersactive = async (req, res) => {
  const { isActive } = req.body;
  try {
    const semester = await Semester.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    if (!semester) {
      return res.status(404).send({ error: "Học kỳ không tồn tại." });
    }
    res.send(semester);
  } catch (error) {
    res.status(500).send({ error: "Lỗi khi cập nhật trạng thái isActive." });
  }
};

exports.addclass = async (req, res) => {
  try {
    const { name, grade, semesterId } = req.body;

    // Kiểm tra xem semester có tồn tại hay không
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      console.log("Semester not found for ID:", semesterId);
      return res.status(404).json({ message: "Semester not found" });
    }

    // Tạo lớp học mới
    const newClass = new Class({
      name,
      grade,
      semester: semesterId,
      students: [],
    });

    // Lưu lớp học mới
    const savedClass = await newClass.save();

    // Thêm lớp học vào semester
    semester.classes.push(savedClass._id);
    await semester.save();

    res.status(201).json(savedClass);
  } catch (error) {
    console.error("Error adding class:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getclasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("semester")
      .populate("teacher")
      .populate("students");
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Error fetching classes" });
  }
};

exports.deletesemester = async (req, res) => {
  const { id } = req.body;

  try {
    // Find the semester by id and delete it
    const deletedSemester = await Semester.findByIdAndDelete(id);

    if (!deletedSemester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    // Find the school year containing this semester
    const schoolYear = await SchoolYear.findOne({ semesters: id });

    if (!schoolYear) {
      return res.status(404).json({ error: "School year not found" });
    }

    // Remove the semester from the semesters array of the school year
    schoolYear.semesters.pull(id);
    await schoolYear.save();

    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    console.error("Error deleting semester:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the semester" });
  }
};

exports.updateclass = async (req, res) => {
  const { _id, name } = req.body;

  try {
    // Tìm và cập nhật lớp học
    const updatedClass = await Class.findByIdAndUpdate(
      _id,
      { name },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res
      .status(200)
      .json({ message: "Class updated successfully", updatedClass });
  } catch (error) {
    console.error("Error updating class:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the class" });
  }
};

exports.deleteclass = async (req, res) => {
  const { id } = req.body;

  try {
    // Find the class by id and delete it
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Find the semester containing this class
    const semester = await Semester.findOne({ classes: id });

    if (!semester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    // Remove the class from the classes array of the semester
    semester.classes.pull(id);
    await semester.save();

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the class" });
  }
};

exports.classes = async (req, res) => {
  try {
    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Tìm học kỳ hiện tại dựa trên ngày hiện tại
    const currentSemester = await Semester.findOne({
      startDate: { $lte: currentDate }, // Học kỳ bắt đầu trước hoặc vào ngày hiện tại
      endDate: { $gte: currentDate }, // Học kỳ kết thúc sau hoặc vào ngày hiện tại
    });

    if (!currentSemester) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy học kỳ hiện tại." });
    }

    // Tìm năm học hiện tại dựa trên ngày hiện tại
    const currentYear = currentDate.getFullYear();
    const schoolYear = await SchoolYear.findOne({
      year: `${currentYear}-${currentYear + 1}`,
    });
    if (!schoolYear) {
      return res.status(404).json({
        message: `Không tìm thấy năm học ${currentYear}-${currentYear + 1}.`,
      });
    }

    // Tìm các lớp học thuộc học kỳ hiện tại và năm học hiện tại
    const classes = await Class.find({
      semester: currentSemester._id,
      schoolYear: schoolYear._id,
    })
      .populate({
        path: "semester",
        select: "name startDate endDate schoolYear",
        populate: {
          path: "schoolYear",
          select: "year",
        },
      })
      .populate("grade schoolYear teacher students creator");

    res.json(classes);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin lớp học:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin lớp học." });
  }
};

// exports.grade = async (req, res) => {
//   const users = await Grade.find({}).select();
//   res.json(users);
// };

//classID --------------------------------------------------
exports.getclassdetails = async (req, res) => {
  const { classId } = req.params;
  try {
    const classDetails = await Class.findById(classId)
      .populate("teacher")
      .populate("students");
    if (!classDetails) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(classDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addteachertoclass = async (req, res) => {
  const { classId } = req.params;
  const { teacherId } = req.body;
  try {
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Student not found" });
    }
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $set: { teacher: teacherId } },
      { new: true }
    )
      .populate("students")
      .populate("teacher");
    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addstudenttoclass = async (req, res) => {
  const { classId } = req.params;
  const { studentId } = req.body;
  try {
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { students: studentId } },
      { new: true }
    )
      .populate("teacher")
      .populate("students");
    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getstudentswithoutclass = async (req, res) => {
  try {
    const classId = req.params.classId; // Lấy classId từ request params

    // Tìm lớp học dựa trên classId
    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    // Lấy semesterId từ lớp học tìm được
    const currentSemesterId = foundClass.semester;

    // Tìm tất cả các lớp trong học kỳ hiện tại
    const classesInCurrentSemester = await Class.find({
      semester: currentSemesterId,
    }).populate("teacher");

    // Lấy danh sách studentIds đã có class trong học kỳ hiện tại
    const studentIdsInClasses = classesInCurrentSemester.reduce(
      (acc, currentClass) => {
        return acc.concat(currentClass.students);
      },
      []
    );

    // Tìm học sinh không có class trong học kỳ hiện tại
    const students = await User.find(
      {
        role: "Student",
        _id: { $nin: studentIdsInClasses }, // Loại trừ những học sinh đã có class
      },
      {
        username: 1,
        firstName: 1,
        lastName: 1,
        _id: 1, // Specify fields to return
      }
    );

    // console.log(json(students))
    res.json(students);
  } catch (error) {
    console.error("Error fetching students without class:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getteacherswithoutclass = async (req, res) => {
  try {
    const classId = req.params.classId; // Lấy classId từ request params

    // Tìm lớp học dựa trên classId
    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    // Lấy semesterId từ lớp học tìm được
    const currentSemesterId = foundClass.semester;

    // Tìm tất cả các lớp trong học kỳ hiện tại
    const classesInCurrentSemester = await Class.find({
      semester: currentSemesterId,
    }).populate("teacher");

    // Lấy danh sách studentIds đã có class trong học kỳ hiện tại
    const studentIdsInClasses = classesInCurrentSemester.reduce(
      (acc, currentClass) => {
        return acc.concat(currentClass.teacher);
      },
      []
    );

    // Tìm học sinh không có class trong học kỳ hiện tại
    const students = await User.find(
      {
        role: "Teacher",
        _id: { $nin: studentIdsInClasses }, // Loại trừ những học sinh đã có class
      },
      {
        username: 1,
        firstName: 1,
        lastName: 1,
        _id: 1, // Specify fields to return
      }
    );

    // console.log(json(students))
    res.json(students);
  } catch (error) {
    console.error("Error fetching students without class:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deletecstudentfromclass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId } = req.body;

    console.log("Request body student ID: " + studentId); // Cleaned up log statement
    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res
        .status(404)
        .json({ message: `Class with ID ${classId} not found.` });
    }

    if (!foundClass.students.includes(studentId)) {
      return res.status(400).json({ message: "Student is not in this class." });
    }

    foundClass.students.pull(studentId);
    await foundClass.save();

    res
      .status(200)
      .json({ message: "Student removed from class successfully." });
  } catch (error) {
    console.error("Error removing student from class:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



// Exam //////////////////////
exports.getExamRequests = async (req, res) => {
  try {
    const semesterId = req.params.semesterId;

    // Kiểm tra học kỳ có tồn tại không
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    // Tìm các đề thi liên quan đến học kỳ này
    const exams = await Exam.find({ semester: semesterId });

    // Phản hồi dữ liệu
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exam requests:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Set Exam Time
exports.setExamTime = async (req, res) => {
  try {
    const { examId } = req.params;
    const { examTime, testTime } = req.body;

    const exam = await ExamSubmission.findByIdAndUpdate(
      examId,
      { examTime, testTime },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    console.error("Error setting exam time:", error.message);
    res.status(500).json({ error: error.message });
  }
};



// Toggle Exam Status
exports.toggleExamStatus = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await ExamSubmission.findById(examId);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    exam.isActive = !exam.isActive;
    await exam.save();

    res.json({ _id: examId, isActive: exam.isActive, grade: exam.grade });
  } catch (error) {
    console.error("Error toggling exam status:", error.message);
    res.status(500).json({ error: error.message });
  }
};