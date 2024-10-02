// services/schoolYearService.js


export const getSchoolYears = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}head/schoolyears`);
  if (!response.ok) {
    throw new Error('Error fetching school years');
  }
  return response.json();
};

export const createSchoolYear = async (year) => {
  const nextYear = parseInt(year) + 1
  const response = await fetch(`${process.env.REACT_APP_API_URL}head/addschoolyear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ year: `${year}-${nextYear}` })
  });
  if (!response.ok) {
    throw new Error('Error creating school year');
  }
  return response.json();
};


export const getSemesters = async (schoolYearId) => {
  console.log(schoolYearId);
  const response = await fetch(`${process.env.REACT_APP_API_URL}head/getsemestersbyschoolyear?schoolYearId=${schoolYearId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Error fetching semesters');
  }
  return response.json();
};


export const createSemester = async (schoolYearId, semesterData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}head/addsemester`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ schoolYearId, ...semesterData })
    });
    console.log(JSON.stringify({ schoolYearId, ...semesterData }))

    if (!response.ok) {
      throw new Error('Error creating semester');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating semester:', error);
    throw error;
  }
};


export const deleteSchoolYear = async (schoolYearId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}head/deleteschoolyear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: schoolYearId })
    });

    if (!response.ok) {
      throw new Error('Error deleting school year');
    }

    return true; // Return true if deletion is successful
  } catch (error) {
    console.error('Error deleting school year:', error);
    throw error;
  }
};

export const updateSemesterDates = async (semesterId, startDate, endDate) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}head/updatesemesterdates`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: semesterId, startDate, endDate })
    });

    if (!response.ok) {
      throw new Error('Error updating semester dates');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating semester dates:', error);
    throw error;
  }
};

export const deleteSemester = async (semesterId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}head/deletesemester`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: semesterId })
    });

    if (!response.ok) {
      // alert('Error deleting semester')
      throw new Error('Error deleting semester');
    }

    return true; // Return true if deletion is successful
  } catch (error) {
    console.error('Error deleting semester:', error);
    throw error;
  }
};


export const toggleSemesterActive = async (semesterId, isActive) => {
  try {
    // Gửi yêu cầu cập nhật trạng thái isActive lên server
    const response = await fetch(`${process.env.REACT_APP_API_URL}head/setsemestersactive/${semesterId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({semesterId ,isActive }), // Gửi trạng thái mới
      
    });
    console.log(JSON.stringify({semesterId ,isActive }))
    if (!response.ok) {
      throw new Error('Cập nhật trạng thái isActive không thành công.');
    }

    // Cập nhật local state của React sau khi cập nhật thành công
    
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái isActive:', error.message);
    // Xử lý lỗi nếu cần thiết (hiển thị thông báo, rollback trạng thái...)
  }
};