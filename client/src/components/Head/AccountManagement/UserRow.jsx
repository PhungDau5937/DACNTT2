// UserRow.js
import { useState } from "react";
import UpdateUser from "./UpdateUser";
import ExportPassword from "./ExportPassword"; // Import the new component
import defaultAVT from "../../../assets/Image/default_avt.png";
import { Link } from "react-router-dom";

const UserRow = ({ user, isSelected, toggleUserSelection, onUserUpdated }) => {
  const role = localStorage.getItem("userRole")
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const openEditForm = () => setIsEditing(true);
  const closeEditForm = () => setIsEditing(false);

  const openExportForm = () => setIsExporting(true);
  const closeExportForm = () => setIsExporting(false);

  const handleUserUpdated = (updatedUser) => {
    onUserUpdated(updatedUser);
    closeEditForm();
  };

  return (
    <>
      <tr className="even:bg-gray-100 odd:bg-white dark:even:bg-stone-800 dark:odd:bg-stone-900 border-b dark:border-stone-700">
        <td className="px-6 py-1 text-sm">
          <input
            type="checkbox"
            id={`checkbox-${user._id}`}
            name={`checkbox-${user._id}`}
            checked={isSelected}
            onChange={() => toggleUserSelection(user._id)}
          />
        </td>
        <td className="px-6 py-1 flex items-center font-medium whitespace-nowrap dark:text-white text-xs">
          <Link
            to={`/${role}/publicprofile/${user._id}`} // Cập nhật đường dẫn tới PublicProfile với userId
            className="flex items-center">
            <img
              src={
                user.avatar
                  ? `${process.env.REACT_APP_API_URL}${user.avatar}`
                  : defaultAVT
              }
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <div>
                {user.lastName} {user.firstName || "-"}
              </div>
              <div className="dark:text-white whitespace-nowrap">
                {user.email || "-"}
              </div>
            </div>
          </Link>
        </td>
        <td className="px-6 py-1 text-xs whitespace-nowrap">{user.username}</td>
        <td className="px-6 py-1 text-xs whitespace-nowrap">{user.address}</td>
        <td className="px-6 py-1 text-xs whitespace-nowrap">{user.status}</td>
        <td className="px-6 py-1 text-xs whitespace-nowrap">
          {user.contactNumber}
        </td>
        <td className="px-6 py-1 text-xs whitespace-nowrap">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-1 text-xs whitespace-nowrap">
          {new Date(user.updatedAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-1 text-xs whitespace-nowrap">
          <button
            onClick={openEditForm}
            className="text-blue-500 hover:text-blue-700">
            Edit
          </button>
          {/* <button
            onClick={openExportForm}
            className="text-green-500 hover:text-green-700 ml-2">
            Export
          </button> */}
          {!user.passwordChanged && (
            <button
              onClick={openExportForm}
              className="text-green-500 hover:text-green-700 ml-2">
              Export
            </button>
          )}
        </td>
      </tr>

      {isEditing && (
        <tr>
          <td colSpan="8">
            <UpdateUser
              isOpen={isEditing}
              onClose={closeEditForm}
              onUserUpdated={handleUserUpdated}
              user={user}
            />
          </td>
        </tr>
      )}
      {isExporting && (
        <tr>
          <td colSpan="8">
            <ExportPassword user={user} onClose={closeExportForm} />
          </td>
        </tr>
      )}
    </>
  );
};

export default UserRow;
