const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa schema cho một exam
const QuestionsSchema = new Schema({
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
});

module.exports = QuestionsSchema;
