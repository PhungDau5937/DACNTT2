// const User = require('../models/User');
// const Semester = require('../models/Semester');

// async function getCurrentSemester() {
//   const today = new Date();
//   const currentSemester = await Semester.findOne({
//     startDate: { $lte: today },
//     endDate: { $gte: today }
//   }).populate('schoolYear');
//   return currentSemester;
// }

// async function userLogin(req, res, next) {
//   const userId = req.body.userId; // Giả sử bạn nhận ID người dùng từ body của request

//   if (!userId) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Lấy thông tin học kỳ hiện tại
//     const currentSemester = await getCurrentSemester();

//     if (currentSemester) {
//       console.log(`Current Semester: ${currentSemester.name}, School Year: ${currentSemester.schoolYear.year}`);
//     } else {
//       console.log('No current semester found.');
//     }

//     req.currentUser = user;
//     req.currentSemester = currentSemester;
//     next();
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

// module.exports = userLogin;


// Hàm tính toán học kỳ
function calculateCurrentSemester(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month >= 9) {
    return {
      year: `${year}-${year + 1}`,
      semester: 'Semester 1',
      startDate: new Date(`${year}-09-01`),
      endDate: new Date(`${year + 1}-01-31`)
    };
  } else if (month >= 6) {
    return {
      year: `${year}-${year + 1}`,
      semester: 'Semester 3',
      startDate: new Date(`${year}-06-01`),
      endDate: new Date(`${year + 1}-08-31`)
    };
  } else {
    return {
      year: `${year - 1}-${year}`,
      semester: 'Semester 2',
      startDate: new Date(`${year}-01-01`),
      endDate: new Date(`${year}-05-31`)
    };
  }
}

// Sử dụng hàm để lấy học kỳ hiện tại
const currentDate = new Date();
const currentSemester = calculateCurrentSemester(currentDate);

console.log(`Current Semester: ${currentSemester.semester} of School Year ${currentSemester.year}`);

module.exports = calculateCurrentSemester;