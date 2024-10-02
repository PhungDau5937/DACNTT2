// const SchoolYear = require('../models/SchoolYear');
// const Semester = require('../models/Semester');

// async function createSchoolYearAndSemesters() {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1;

//   // Hàm tính toán học kỳ
//   function calculateSemester(date) {
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;

//     if (month >= 9) {
//       return {
//         year: `${year}-${year + 1}`,
//         semester: 'Semester 1',
//         startDate: new Date(`${year}-09-01`),
//         endDate: new Date(`${year + 1}-01-31`)
//       };
//     } else if (month >= 6) {
//       return {
//         year: `${year}-${year + 1}`,
//         semester: 'Semester 3',
//         startDate: new Date(`${year}-06-01`),
//         endDate: new Date(`${year + 1}-08-31`)
//       };
//     } else {
//       return {
//         year: `${year - 1}-${year}`,
//         semester: 'Semester 2',
//         startDate: new Date(`${year}-01-01`),
//         endDate: new Date(`${year}-05-31`)
//       };
//     }
//   }

//   // Tính toán học kỳ hiện tại, trước và sau
//   const currentSemester = calculateSemester(currentDate);
//   const previousSemester = calculateSemester(new Date(currentSemester.startDate.getTime() - 1));
//   const nextSemester = calculateSemester(new Date(currentSemester.endDate.getTime() + 1));

//   const semesters = [previousSemester, currentSemester, nextSemester];

//   for (let semester of semesters) {
//     // Tìm hoặc tạo năm học tương ứng
//     let schoolYear = await SchoolYear.findOne({ year: semester.year });
//     if (!schoolYear) {
//       schoolYear = new SchoolYear({ year: semester.year });
//       await schoolYear.save();
//     }

//     // Tìm học kỳ trong cơ sở dữ liệu
//     let semesterDoc = await Semester.findOne({
//       name: semester.semester,
//       startDate: semester.startDate,
//       endDate: semester.endDate,
//       schoolYear: schoolYear._id
//     });

//     // Nếu không tìm thấy, tạo mới học kỳ
//     if (!semesterDoc) {
//       semesterDoc = new Semester({
//         name: semester.semester,
//         startDate: semester.startDate,
//         endDate: semester.endDate,
//         schoolYear: schoolYear._id
//       });
//       await semesterDoc.save();
//     }
//   }

//   console.log(`Current Semester: ${currentSemester.semester} of School Year ${currentSemester.year}`);
// }

// module.exports = createSchoolYearAndSemesters;