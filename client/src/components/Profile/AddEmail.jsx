import React, { useState } from 'react';
import { FaEnvelope, FaCheck } from 'react-icons/fa';

const AddEmail = ({ onSuccess, onCancel }) => {
  const [newEmail, setNewEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const handleSendCode = async () => {
    const userId = localStorage.getItem('username');
    if (!userId) {
      setError('User ID not found');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/send-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, email: newEmail })
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      alert('Verification code sent successfully');
      setIsCodeSent(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError('Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    const userId = localStorage.getItem('username');
    if (!userId) {
      setError('User ID not found');
      return;
    }
    if (!newEmail || !verificationCode) {
      setError('Please enter the email and verification code');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/verify-email-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, email: newEmail, code: verificationCode })
      });

      if (!response.ok) {
        throw new Error('Failed to verify code');
      }

      alert('Email verified successfully');
      setIsEmailVerified(true);
      onSuccess(); // Notify parent component
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationError('Failed to verify code. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border bg-white dark:bg-stone-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">Add New Email</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {isCodeSent ? (
        <>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="input mb-2 p-2 border border-stone-300 rounded"
          />
          <button
            onClick={handleVerifyCode}
            disabled={!verificationCode.trim()}
            className={`btn bg-stone-500 text-white p-2 rounded ${!verificationCode.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaCheck className="inline mr-2" /> Verify Code
          </button>
          {verificationError && <p className="text-red-500 mb-2">{verificationError}</p>}
        </>
      ) : (
        <>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New Email"
            className="input mb-2 p-2 border border-stone-300 rounded"
          />
          <button
            onClick={handleSendCode}
            disabled={!newEmail.trim()}
            className={`btn bg-stone-500 text-white p-2 rounded ${!newEmail.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaEnvelope className="inline mr-2" /> Send Verification Code
          </button>
        </>
      )}
      <button type="button" onClick={onCancel} className="btn bg-stone-500 text-white p-2 rounded mt-2">Cancel</button>
    </div>
  );
  
};

export default AddEmail;