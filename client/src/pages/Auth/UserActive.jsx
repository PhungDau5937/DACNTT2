import React, { useEffect } from 'react';

const UserActive = () => {
  useEffect(() => {
    // Lưu giá trị vào localStorage khi trang web được mở
    localStorage.setItem('userActive', 'true');

    // Hàm để xóa giá trị khỏi localStorage khi trang web được đóng
    const handleUnload = () => {
      localStorage.removeItem('userActive');
    };

    // Thêm listener cho sự kiện beforeunload
    window.addEventListener('beforeunload', handleUnload);

    // Cleanup listener khi component được unmount
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <div>
      <h1>Chào mừng đến với trang web!</h1>
    </div>
  );
};

export default UserActive;