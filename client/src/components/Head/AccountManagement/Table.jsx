import React from "react";
import { useSelector } from "react-redux";
import UserRow from "./UserRow";
import Pagination from "./Pagination"; // Import component Pagination

const Table = ({
  users,
  selectedUsers,
  toggleUserSelection,
  toggleSelectAll,
  onPageChange,
  currentPage,
  totalUsers,
  itemsPerPage,
  onUserUpdated
}) => {
  const language = useSelector((state) => state.language.language); // Lấy ngôn ngữ từ Redux
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
          <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
            <tr className="whitespace-nowrap">
              <th scope="col" className="px-6 py-3">
                <input
                  type="checkbox"
                  name="selectAllCheckbox"
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-3">
              {language === "vi" ? "Người dùng" : "User"}
              </th>
              <th scope="col" className="px-6 py-3">
              {language === "vi" ? "ID" : "ID"}
              </th>
              <th scope="col" className="px-6 py-3">
                {language === "vi" ? "Địa chỉ" : "Address"}
              </th>
              <th scope="col" className="px-6 py-3">
                {language === "vi" ? "Trạng thái" : "Status"}
              </th>
              <th scope="col" className="px-6 py-3">
                {language === "vi" ? "Sdt" : "Number"}
              </th>
              <th scope="col" className="px-6 py-3">
                {language === "vi" ? "Ngày tạo" : "Created"}
              </th>
              <th scope="col" className="px-6 py-3">
                {language === "vi" ? "Cập nhật" : "Updated"}
              </th>
              <th scope="col" className="px-6 py-3">
                {language === "vi" ? "Thao tác" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
        {users.map((user) => (
          <UserRow
            key={user._id}
            user={user}
            isSelected={selectedUsers.includes(user._id)}
            toggleUserSelection={toggleUserSelection}
            onUserUpdated={onUserUpdated}
          />
        ))}
      </tbody>
        </table>
      </div>

      {/* Sử dụng component Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onUserUpdated={onUserUpdated}
      />
    </div>
  );
};

export default Table;
