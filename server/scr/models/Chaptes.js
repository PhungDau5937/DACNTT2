const QuestionsSchema = require("./Questions"); /* import QuestionsSchema from "./Questions"; */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa schema cho một exam
const ChaptersSchema = new Schema({
    chapterID: { type: Number, default: "" },
    titleChapter: { type: String, default: "" },
    chapterScore: { type: Number, default: 2 },
    questions: { type: [QuestionsSchema], default: [] },
});

module.exports = ChaptersSchema;