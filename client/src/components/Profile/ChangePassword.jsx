import React, { useState } from 'react';
import { FaLock, FaCheck } from 'react-icons/fa';

const ChangePassword = ({ onSuccess, onCancel }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const userId = localStorage.getItem('username');
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, ...passwordData })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      alert('Password changed successfully');
      onSuccess(); // Notify parent component about the successful change
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white border dark:bg-stone-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">Change Password</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="password"
          name="oldPassword"
          value={passwordData.oldPassword}
          onChange={handleChange}
          placeholder="Old Password"
          className="input mb-2 dark:bg-stone-800 dark:text-white"
        />
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          className="input mb-2 dark:bg-stone-800 dark:text-white"
        />
        <input
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="input mb-2 dark:bg-stone-800 dark:text-white"
        />
        <button type="submit" className="btn bg-stone-500 text-white p-2 rounded">
          <FaCheck className="inline mr-2" /> Change Password
        </button>
        <button type="button" onClick={onCancel} className="btn bg-stone-500 text-white p-2 rounded mt-2">Cancel</button>
      </form>
    </div>
  );
  
};

export default ChangePassword;
