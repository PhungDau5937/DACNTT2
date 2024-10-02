  // models/Score.js
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  // Hàm kiểm tra số lượng phần tử trong mảng không vượt quá 3
  function arrayLimit(val) {
    return val.length <= 3;
  }

  const scoreSchema = new Schema({
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Thay đổi từ 'Student' thành 'User'
    scores: {
      oral: {
        type: [{ type: Number, default: null, min: 0, max: 10 }], // Ràng buộc số lượng tối đa là 3 và giá trị từ 0 đến 10
        validate: [arrayLimit, '{PATH} exceeds the limit of 3'] // Ràng buộc số lượng tối đa là 3
      },
      fifteenMinutes: {
        type: [{ type: Number, default: null, min: 0, max: 10 }], // Ràng buộc số lượng tối đa là 3 và giá trị từ 0 đến 10
        validate: [arrayLimit, '{PATH} exceeds the limit of 3'] // Ràng buộc số lượng tối đa là 3
      },
      midTerm: { type: Number, default: null, min: 0, max: 10 }, // Ràng buộc giá trị từ 0 đến 10
      finalExam: { type: Number, default: null, min: 0, max: 10 } // Ràng buộc giá trị từ 0 đến 10
    },
    averageScore: {
      type: Number,
      default: function() {
        return this.calculateAverageScore();
      }
    }
  }, { timestamps: true });

  // Hàm tính toán điểm trung bình
  scoreSchema.methods.calculateAverageScore = function() {
    const { oral, fifteenMinutes, midTerm, finalExam } = this.scores;

    // Tính tổng điểm miệng và điểm 15 phút
    const oralScores = oral.filter(score => score !== null);
    const fifteenMinuteScores = fifteenMinutes.filter(score => score !== null);

    // Tính tổng điểm miệng và điểm 15 phút, áp dụng hệ số 1
    const totalOralScore = oralScores.reduce((acc, score) => acc + score, 0);
    const totalFifteenMinuteScore = fifteenMinuteScores.reduce((acc, score) => acc + score, 0);

    // Điểm miệng và điểm 15 phút
    const averageOralScore = oralScores.length > 0 ? totalOralScore / oralScores.length : 0;
    const averageFifteenMinuteScore = fifteenMinuteScores.length > 0 ? totalFifteenMinuteScore / fifteenMinuteScores.length : 0;

    // Tính điểm trung bình với hệ số
    const weightedOralScore = averageOralScore * 1; // Hệ số 1
    const weightedFifteenMinuteScore = averageFifteenMinuteScore * 1; // Hệ số 1
    const weightedMidTermScore = (midTerm !== null ? midTerm : 0) * 2; // Hệ số 2
    const weightedFinalExamScore = (finalExam !== null ? finalExam : 0) * 3; // Hệ số 3

    // Tổng số hệ số và tổng điểm có trọng số
    const weights = [1, 1, 2, 3];
    const totalWeight = weights.reduce((acc, weight, index) => {
      if ((index === 0 && averageOralScore > 0) || (index === 1 && averageFifteenMinuteScore > 0) || 
          (index === 2 && midTerm !== null) || (index === 3 && finalExam !== null)) {
        return acc + weight;
      }
      return acc;
    }, 0);

    const totalScore = weightedOralScore + weightedFifteenMinuteScore + weightedMidTermScore + weightedFinalExamScore;

    return totalWeight > 0 ? totalScore / totalWeight : 0; // Điểm trung bình có hệ số
  };

  module.exports = mongoose.model('Score', scoreSchema);