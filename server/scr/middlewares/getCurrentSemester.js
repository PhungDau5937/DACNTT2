const Semester = require("../models/Semester");

const getCurrentSemester = async (req, res, next) => {
  try {
    // Lấy ngày hiện tại
    const currentDate = new Date();
    console.log(currentDate)

    // Tìm học kỳ hiện tại dựa trên ngày hiện tại


    const currentSemester = await Semester.findOne({
      startDate: { $lte: currentDate }, // Học kỳ bắt đầu trước hoặc vào ngày hiện tại
      endDate: { $gte: currentDate }, // Học kỳ kết thúc sau hoặc vào ngày hiện tại
    });


    if (!currentSemester) {
      return res.status(404).json({ message: 'Không tìm thấy học kỳ hiện tại.' });
    }

    // Gán thông tin học kỳ vào request để sử dụng sau này
    req.currentSemester = currentSemester;
    next();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin học kỳ:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin học kỳ.' });
  }
};

module.exports = getCurrentSemester;