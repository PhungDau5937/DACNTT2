const mongoose = require('mongoose');

const schoolYearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(value) {
        // Kiểm tra định dạng 'YYYY-YYYY'
        return /^\d{4}-\d{4}$/;
      },
      message: props => `${props.value} không phải là một năm học hợp lệ!`
    }
  },
  semesters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester'
  }]
});




const SchoolYear = mongoose.model('SchoolYear', schoolYearSchema);

module.exports = SchoolYear;