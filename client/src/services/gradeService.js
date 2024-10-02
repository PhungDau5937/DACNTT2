export const getActiveSemesters = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}head/getactivesemesters`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Error fetching active semesters');
  }
  return response.json();
};


export const getClass = async (semesterId) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}head/getclasses/${semesterId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  console.log(semesterId)

  if (!response.ok) {
    throw new Error('Error fetching class details');
  }
  return response.json();
};



export const addClass = async (newClass, semesterId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}head/addclass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClass),
    });
    console.log(JSON.stringify(newClass))

    if (!response.ok) {
      throw new Error('Error adding class');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};


export const deleteClass = async (classId) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}head/deleteclass`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( {id: classId} )
  });

  if (!response.ok) {
    throw new Error('Error deleting class');
  }
  return true; // Return true if deletion is successful
};


export const updateClass = async (updatedClass) => {
  try {
    const apiUrl = `${process.env.REACT_APP_API_URL}head/updateclass`;
    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedClass),
    });

    if (!response.ok) {
      throw new Error('Error updating class');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};