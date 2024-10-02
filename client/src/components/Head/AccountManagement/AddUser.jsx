import React, { useState } from "react";
import Locations from "../../Locations/Locations";

const AddUser = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: {
      city: "",
      district: "",
      ward: "",
    },
    contactNumber: "",
    role: "Student",
  });

  const [errors, setErrors] = useState({});

  const formatPhoneNumber = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Format phone number as 012-345-6789
    if (numericValue.length > 3 && numericValue.length <= 6) {
      return numericValue.replace(/(\d{3})(\d{1,3})/, "$1-$2");
    } else if (numericValue.length > 6) {
      return numericValue.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3");
    }
    return numericValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      const formattedValue =
        name === "contactNumber" ? formatPhoneNumber(value) : value;
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    }

    const phoneNumberRegex = /^0\d{2}-\d{3}-\d{4}$/;
    if (name === "contactNumber" && !phoneNumberRegex.test(value)) {
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
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName) newErrors.lastName = "Vui lòng nhập họ và tên đệm";
    const phoneRegex = /^0\d{2}-\d{3}-\d{4}$/;
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber =
        "Số điện thoại phải bắt đầu bằng số 0 và có định dạng 012-345-6789";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}head/adduser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onUserAdded(data);
        onClose();
      } else {
        console.error("Error adding user:", response.statusText);
        onClose();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white w-96 p-6 rounded-lg shadow-lg">
        <div className="absolute top-0 right-0 p-2">
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="text-left">
          <h2 className="text-lg font-semibold mb-4">Thêm người dùng mới</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-xs text-gray-700"
              style={{ textAlign: "left" }}>
              Họ và tên đệm
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`border ${
                errors.lastName ? "border-red-500 dark:border-red-500" : "border-gray-300"
              } rounded-md w-full p-2 mt-1`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-xs text-gray-700"
              style={{ textAlign: "left" }}>
              Tên
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`border ${
                errors.firstName ? "border-red-500 dark:border-red-500" : "border-gray-300"
              } rounded-md w-full p-2 mt-1`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-xs text-gray-700"
              style={{ textAlign: "left" }}>
              Địa chỉ
            </label>
            <Locations onChange={handleChange} />
            {errors.addressCity && (
              <p className="text-red-500 text-xs mt-1">{errors.addressCity}</p>
            )}
            {errors.addressDistrict && (
              <p className="text-red-500 text-xs mt-1">
                {errors.addressDistrict}
              </p>
            )}
            {errors.addressWard && (
              <p className="text-red-500 text-xs mt-1">{errors.addressWard}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="contactNumber"
              className="block text-xs text-gray-700"
              style={{ textAlign: "left" }}>
              Số điện thoại
            </label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={`border ${
                errors.contactNumber ? "border-red-500" : "border-gray-300"
              } rounded-md w-full p-2 mt-1`}
              maxLength={12}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-xs text-gray-700"
              style={{ textAlign: "left" }}>
              Vai trò
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1">
              <option value="Head">Head</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-3 py-1 text-xs text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
