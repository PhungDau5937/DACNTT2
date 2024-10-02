// File: Profile.js
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('username'); // Lấy _id từ localStorage
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}auth/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Thêm token vào header yêu cầu
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading user information...</p>
      ) : user ? (
        <div>
          <h2>{user.firstName} {user.lastName}</h2>
          <p>Email: {user.email}</p>
          <p>Date of Birth: {user.dateOfBirth}</p>
          <p>Gender: {user.gender}</p>
          <p>Address: {user.address}</p>
          <p>Contact Number: {user.contactNumber}</p>
          {/* Render các thông tin khác */}
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default Profile;