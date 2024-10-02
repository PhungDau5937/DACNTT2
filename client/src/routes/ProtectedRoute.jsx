import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated, selectUserRole } from "../Redux/Auth/authSelectors";
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/Auth/authSlice';

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const dispatch = useDispatch();

  // Chuyển hướng đến trang đăng nhập nếu chưa xác thực
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra userRole và chuyển hướng nếu không có quyền
  if (!userRole || !allowedRoles.includes(userRole)) {
    dispatch(logout());
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
