const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApprovedExamSchema = new Schema({
  examID: {
    type: Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  ExamSubmissionID: {
    type: Schema.Types.ObjectId,
    ref: 'ExamSubmission',
    required: true
  },
  titleExam: { type: String, default: "" },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },  
  examType: {
    type: String,
    enum: ['midterm', 'final'],
    required: true
  },
  classExam: { type: String, default: "" },
  time: { type: String, default: "" },
  score: { type: String, default: "" },
  description: { type: String, default: "" },
  chapters: { type: [Schema.Types.Mixed], default: [] },
  teacherID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvalDate: {
    type: Date,
    default: Date.now
  }
});

const ApprovedExam = mongoose.model('ApprovedExam', ApprovedExamSchema);

module.exports = ApprovedExam;
