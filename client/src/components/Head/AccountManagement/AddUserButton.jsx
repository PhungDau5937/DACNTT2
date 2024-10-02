// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import AddUser from "../../components/UserManagement/AddUser";

// function AddUserButton() {
//   const language = useSelector((state) => state.language.language); // Lấy ngôn ngữ từ Redux
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="mb-4 text-right">
//       <button
//         className="px-3 py-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//         onClick={openModal}>
//         {language === "vi" ? "Thêm" : "Add user "}
//       </button>
//       <AddUser isOpen={isModalOpen} onClose={closeModal} />
//     </div>
//   );
// }

// export default AddUserButton;
