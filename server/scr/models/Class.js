// models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  grade: {
    type: String,
    enum: ['10', '11', '12'], // Enum cho các cấp lớp học của bạn
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: [{
      validator: async function(value) {
        if (!value) return true; // Cho phép giá trị null hoặc undefined
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'Teacher';
      },
      message: 'Teacher reference must be a user with role "Teacher" or empty.'
    }],
    required: false // Trường teacher là tùy chọn
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'Student';
      },
      message: 'Student reference must be a user with role "Student".'
    }
  }],

});

classSchema.pre('remove', { document: true }, async function(next) {
  try {
    // Tìm Semester chứa Class này
    const semester = await mongoose.model('Semester').findById(this.semester);
    if (!semester) {
      throw new Error('Semester not found.');
    }

    // Xóa Class khỏi danh sách classes của Semester
    semester.classes.pull(this._id);

    // Lưu Semester trước khi xóa Class
    await semester.save();

    next();
  } catch (error) {
    next(error);
  }
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;