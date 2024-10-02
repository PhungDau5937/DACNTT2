import React from 'react';
import { Link } from 'react-router-dom';
import { MdSettings, MdLogout, MdAccountCircle } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Auth/authSlice';

const ProfileMenu = ({ onClose }) => {
  const dispatch = useDispatch();
  
  // Lấy vai trò từ localStorage
  const role = localStorage.getItem('userRole'); // Thay đổi key nếu bạn sử dụng key khác

  const handleLogout = () => {
    dispatch(logout()); // Gọi action logout từ Redux
    onClose(); // Đóng menu sau khi nhấn Đăng xuất
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-md shadow-lg z-10">
      <Link
        to={`/${role}/profile`} // Sử dụng vai trò để xác định liên kết
        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-700"
        onClick={onClose}
      >
        <MdAccountCircle className="inline mr-2" /> Quản lý tài khoản
      </Link>

      <Link
        to="/login"
        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-700"
        onClick={handleLogout}
      >
        <MdLogout className="inline mr-2" /> Đăng xuất
      </Link>
    </div>
  );
};

export default ProfileMenu;