const ChaptersSchema = require("./Chaptes"); // Import ChaptersSchema from "./Chaptes"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa schema cho một exam
const ExamSchema = new Schema({
  // examID: { type: Number, default: "" },
  titleExam: { type: String, default: "" },
  status: { type: String, default: "" },
  classExam: { type: String, default: "" },
  time: { type: String, default: "" },
  score: { type: String, default: "" },
  description: { type: String, default: "" },
  chapters: { type: [ChaptersSchema], default: [] },
  teacherID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});


const Exam = mongoose.model("Exam", ExamSchema);

module.exports = Exam;
// module.exports = mongoose.model("exam", ExamSchema);     