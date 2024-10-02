const mongoose = require('mongoose');
const Exam = require('./Exam');
const ApprovedExam = require('./ApprovedExam');


const ExamSubmissionSchema = new mongoose.Schema({
  examID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: false
  }],
  approvedExamID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApprovedExam',
    required: false
  }],
  semesterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  grade: {
    type: String,
    enum: ['10', '11', '12'],
    required: true
  },
  examType: {
    type: String,
    enum: ['midterm', 'final'],
    required: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  reviewDate: {
    type: Date
  },
  comments: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  },
  examTime: {
    type: Date
  },
  testTime: {
    type: String,
    enum: ['45', '90', '120'],
    default: '45'
  },
  examPassword: {
    type: String,
    default: '',
    required: false
  },
  
  
});

// Update reviewDate when status changes to Approved or Rejected
ExamSubmissionSchema.pre('save', async function (next) {
  if (this.isModified('isActive') && (this.isActive === true || this.isActive === false)) {
    this.reviewDate = Date.now();
    if (this.status === 'Approved') {
      // Copy exam data to ApprovedExam collection
      const exam = await Exam.findById(this.examID).exec();
      if (exam) {
        const approvedExam = new ApprovedExam({
          examID: exam._id,
          titleExam: exam.titleExam,
          status: exam.status,
          classExam: exam.classExam,
          time: exam.time,
          score: exam.score,
          description: exam.description,
          chapters: exam.chapters,
          teacherID: exam.teacherID
        });
        await approvedExam.save();
      }
    }
  }
  next();
});

// Create indexes for frequently queried fields
ExamSubmissionSchema.index({ examID: 1, semesterID: 1, grade: 1, examType: 1 });
ExamSubmissionSchema.index({ status: 1 });

const ExamSubmission = mongoose.model('ExamSubmission', ExamSubmissionSchema);

module.exports = ExamSubmission;
