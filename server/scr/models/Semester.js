const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['I', 'II', 'III'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  schoolYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolYear',
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam' // Reference the "Exam" collection
  },
  midtermExams: [{
    grade: { type: String, enum: ['10', '11', '12'], required: true },
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamSubmission' }]
  }],
  finalExams: [{
    grade: { type: String, enum: ['10', '11', '12'], required: true },
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamSubmission' }]
  }]
  
});

semesterSchema.pre('remove', { document: true }, async function(next) {
  try {
    // Tìm schoolyear có chứa semester này
    const schoolYear = await mongoose.model('SchoolYear').findById(this.schoolYear);
    if (!schoolYear) {
      throw new Error('School year not found.');
    }

    // Xóa semester khỏi danh sách semesters của schoolyear
    schoolYear.semesters.pull(this._id);

    // Lưu schoolyear trước khi xóa semester 
    await schoolYear.save();

    next();
  } catch (error) {
    next(error);
  }
});

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;