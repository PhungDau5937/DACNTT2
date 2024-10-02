// ToastNotification.js
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = ({ message, type, position = "top-right", autoClose = 5000 }) => {

  // Hàm hiển thị thông báo
  const showToast = () => {
    switch (type) {
      case 'success':
        toast.success(message, { position, autoClose });
        break;
      case 'error':
        toast.error(message, { position, autoClose });
        break;
      case 'info':
        toast.info(message, { position, autoClose });
        break;
      case 'warning':
        toast.warning(message, { position, autoClose });
        break;
      default:
        toast(message, { position, autoClose });
    }
  };

  // Hiển thị thông báo ngay khi component được gọi
  showToast();

  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};

export default ToastNotification;