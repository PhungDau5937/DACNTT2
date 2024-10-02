
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