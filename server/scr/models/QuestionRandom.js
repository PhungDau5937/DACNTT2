const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa schema cho một exam
const QuestionRandomsSchema = new mongoose.Schema({
  questionID: { type: Number, default: "" },
  type: { type: String, default: "" },
  titleQuestion: { type: String, default: "" },
  options: { type: [String] , default: [] },
  answer: { type: String, default: "" },
  /* Đục lỗ */
  optionsDoc: { type: [[String]] , default: [] },
  answerDoc: { type: [String], default: [] },
  /* Đục lỗ */
  level: { type: String, default: "" },
}, { collection: 'questionrandoms' });

module.exports = mongoose.model('Question', QuestionRandomsSchema);
