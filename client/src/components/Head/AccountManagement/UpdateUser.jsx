import React, { useState, useEffect } from "react";

const UpdateUser = ({ isOpen, onClose, onUserUpdated, user }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    role: "Student",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        contactNumber: user.contactNumber || "",
        role: user.role || "Student",
        status: user.status || "active",
      });
    }
  }, [user]);
  console.log(user)
  const formatPhoneNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length > 3 && numericValue.length <= 6) {
      return numericValue.replace(/(\d{3})(\d{1,3})/, "$1-$2");
    } else if (numericValue.length > 6) {
      return numericValue.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3");
    }
    return numericValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "contactNumber" ? formatPhoneNumber(value) : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));

    if (name === "contactNumber") {
      const phoneNumberRegex = /^0\d{2}-\d{3}-\d{4}$/;
      if (!phoneNumberRegex.test(formattedValue)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          contactNumber: "Số điện thoại không hợp lệ",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          contactNumber: "",
        }));
      }
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName) newErrors.lastName = "Vui lòng nhập họ và tên đệm";
    const phoneRegex = /^0\d{2}-\d{3}-\d{4}$/;
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = "Số điện thoại phải bắt đầu bằng số 0 và có định dạng 012-345-6789";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}head/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof onUserUpdated === "function") {
          onUserUpdated(data);
        } else {
          console.error("onUserUpdated is not a function");
        }
        onClose();
      } else {
        console.error("Error updating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white dark:bg-stone-900 w-96 p-6 rounded-lg shadow-lg">
        <div className="absolute top-0 right-0 p-2">
          <button className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100" onClick={onClose}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className="text-lg font-bold mb-4 text-stone-900 dark:text-stone-100">Cập nhật thông tin người dùng</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-stone-300 dark:border-stone-600 rounded-md p-2 dark:bg-stone-800 dark:text-stone-100"
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Họ và tên đệm</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border border-stone-300 dark:border-stone-600 rounded-md p-2 dark:bg-stone-800 dark:text-stone-100"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Tên</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border border-stone-300 dark:border-stone-600 rounded-md p-2 dark:bg-stone-800 dark:text-stone-100"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="contactNumber" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Số điện thoại</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.contactNumber ? "border-red-500" : "border-stone-300 dark:border-stone-600"
              } rounded-md p-2 dark:bg-stone-800 dark:text-stone-100`}
              maxLength={12}
            />
            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Vai trò</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-stone-300 dark:border-stone-600 rounded-md p-2 dark:bg-stone-800 dark:text-stone-100"
              disabled
            >
              <option value="Head">Head</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Trạng thái</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-stone-300 dark:border-stone-600 rounded-md p-2 dark:bg-stone-800 dark:text-stone-100"
            >
              <option value="active">Active</option>
              <option value="locked">Locked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-stone-300 dark:bg-stone-600 rounded hover:bg-stone-400 dark:hover:bg-stone-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;