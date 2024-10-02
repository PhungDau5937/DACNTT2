import React, { useState, useEffect } from "react";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import AddEmail from "./AddEmail";
import { FaEdit, FaLock, FaEnvelope } from "react-icons/fa";
import {
  MdEmail,
  MdDateRange,
  MdPerson,
  MdLocationOn,
  MdPhone,
} from "react-icons/md";
import { format } from "date-fns"; // Import format function from date-fns

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [addingEmail, setAddingEmail] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem("username");
      if (!userId) throw new Error("User ID not found in localStorage");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleProfileSave = () => {
    setEditingProfile(false);
    fetchUserProfile(); // Re-fetch user data after profile update
  };

  const handleProfileCancel = () => {
    setEditingProfile(false);
  };

  const handlePasswordSuccess = () => {
    setChangingPassword(false);
    fetchUserProfile(); // Re-fetch user data after password change
  };

  const handleEmailSuccess = () => {
    setAddingEmail(false);
    fetchUserProfile(); // Re-fetch user data after adding new email
  };

  const ProfileField = ({ icon, label, value }) => (
    <div className="flex items-center space-x-2 text-stone-700 dark:text-stone-300">
      <span className="text-stone-400 dark:text-stone-500">{icon}</span>
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );

  const ActionButton = ({ onClick, icon, label }) => (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 bg-stone-500 hover:bg-stone-600 text-white rounded-full transition-colors duration-300">
      {React.cloneElement(icon, { className: "mr-2" })}
      <span>{label}</span>
    </button>
  );

  // Format dateOfBirth to display only day, month, and year
  const formattedDateOfBirth = user?.dateOfBirth
    ? format(new Date(user.dateOfBirth), "dd MMMM yyyy")
    : "N/A";

  return (
    <section className="p-6 max-w-4xl mx-auto bg-white dark:bg-stone-800 rounded-lg shadow-lg transition-all duration-300">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-500"></div>
        </div>
      ) : (
        <>
          {editingProfile ? (
            <EditProfile
              user={user}
              onSave={handleProfileSave}
              onCancel={handleProfileCancel}
            />
          ) : changingPassword ? (
            <ChangePassword
              onSuccess={handlePasswordSuccess}
              onCancel={() => setChangingPassword(false)}
            />
          ) : addingEmail ? (
            <AddEmail
              onSuccess={handleEmailSuccess}
              onCancel={() => setAddingEmail(false)}
            />
          ) : (
            <article className="text-center">
              <div className="relative inline-block">
                <img
                  src={`${process.env.REACT_APP_API_URL}${user.avatar}`}
                  alt="Avatar"
                  className="m-4 w-60 h-60 rounded-full object-cover mx-auto border-4 border-stone-200 dark:border-stone-600 shadow"
                />
              </div>
              <h2 className="text-stone-600 dark:text-stone-400 mt-2 text-lg font-medium">
                {user.role}
              </h2>
              <h2 className="text-3xl font-bold mt-2 text-stone-800 dark:text-stone-100">
                {user.lastName} {user.firstName}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mt-4 text-lg font-medium">
                {user.username}
              </p>

              <div className="relative inline-block text-center text-stone-600 dark:text-stone-400 mt-2 text-lg font-medium">
                <ProfileField
                  icon={<MdEmail className="text-stone-400" />}
                  label="Email"
                  value={user.email}
                />
                <ProfileField
                  icon={<MdDateRange className="text-stone-400" />}
                  label="Date of Birth"
                  value={formattedDateOfBirth}
                />
                <ProfileField
                  icon={<MdPerson className="text-stone-400" />}
                  label="Gender"
                  value={user.gender}
                />
                <ProfileField
                  icon={<MdLocationOn className="text-stone-400" />}
                  label="Address"
                  value={user.address}
                />
                <ProfileField
                  icon={<MdPhone className="text-stone-400" />}
                  label="Contact Number"
                  value={user.contactNumber}
                />
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <ActionButton
                  onClick={() => setEditingProfile(true)}
                  icon={<FaEdit />}
                  label="Edit Profile"
                  color="stone"
                />
                <ActionButton
                  onClick={() => setChangingPassword(true)}
                  icon={<FaLock />}
                  label="Change Password"
                  color="stone"
                />
                <ActionButton
                  onClick={() => setAddingEmail(true)}
                  icon={<FaEnvelope />}
                  label="Add New Email"
                  color="stone"
                />
              </div>
            </article>
          )}
        </>
      )}
    </section>
  );
};

export default Profile;
