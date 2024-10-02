import React, { useState, useEffect } from "react";
import Loading from "../../components/Head/AccountManagement/LoadingTable";
import Table from "../../components/Head/AccountManagement/Table";
import AddUser from "../../components/Head/AccountManagement/AddUser";
import SearchBar from "../../components/Head/AccountManagement/SearchBar";
import ActionButton from "../../components/Head/AccountManagement/ActionButton";
import UserActions from "../../components/Head/AccountManagement/UserActions";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(25); // Số lượng dòng mỗi trang

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}head/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUsers(data);
          setLoading(false);
        } else {
          console.log("Failed to fetch users:", response.statusText);
        }
      } catch (error) {
        console.log("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi tìm kiếm
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi thay đổi số lượng dòng mỗi trang
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
  };

  const handleBlockUsers = async (selectedUsers) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}head/blockusers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (response.ok) {
        console.log("Khóa các người dùng thành công:", selectedUsers);
        // Cập nhật state hoặc xử lý sau khi khóa
      } else {
        console.error("Lỗi khi khóa người dùng:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi khóa người dùng:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (users.length === 0) {
    return <div>Không có người dùng nào được đăng ký.</div>;
  }

  // Lọc người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter((user) => {
    const searchTextLower = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchTextLower) ||
      user.lastName?.toLowerCase().includes(searchTextLower) ||
      user.email?.toLowerCase().includes(searchTextLower) ||
      user.role?.toLowerCase().includes(searchTextLower)
    );
  });

  // Tính toán chỉ mục bắt đầu và kết thúc cho dữ liệu trang hiện tại
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentPageUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  // Xử lý việc chọn người dùng
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // Chọn hoặc bỏ chọn tất cả người dùng
  const toggleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Xử lý khi chuyển đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
      <header className="flex flex-col sm:flex-row justify-between items-end pb-4 border-b border-gray-300">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold dark:text-white">Users Table</h1>
          <p className="text-sm text-stone-600 dark:text-white">
            A list of all users in your account including their name, title,
            email, and roleee
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
        </div>
      </header>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <select
            id="itemsPerPage"
            name="itemsPerPage"
            className="border border-gray-300 rounded-md p-1"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

        </div>

        <div className="flex items-center"></div>

        <div className="flex items-center text-sm space-x-4">

          <ActionButton
            onClick={openModal}
            text="Thêm"
            colorClass="bg-blue-500"
          />

          <UserActions
            selectedUsers={selectedUsers}
            onBlock={handleBlockUsers}
          />
        </div>
      </div>

      <p className="text-sm text-stone-600 dark:text-white pb-4">
        <span className='font-bold'>SL</span>:{" "}
        {selectedUsers.length}
      </p>
      <Table
        users={currentPageUsers}
        selectedUsers={selectedUsers}
        toggleUserSelection={toggleUserSelection}
        toggleSelectAll={toggleSelectAll}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        totalUsers={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onUserUpdated={handleUserUpdated}
      />

      <AddUser
        isOpen={isModalOpen}
        onClose={closeModal}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default UserManagement;