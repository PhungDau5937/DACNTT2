import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import WebFont from 'webfontloader'


const ExportPassword = ({ user, onClose }) => {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Droid Sans', 'Roboto']
      }
    })
  }, [])

  // Hàm để fetch mật khẩu người dùng
  const fetchUserPassword = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}head/userpass/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Thêm các headers khác nếu cần, ví dụ Authorization
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching user password:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch mật khẩu khi component mount hoặc user thay đổi
  useEffect(() => {
    const getUserPassword = async () => {
      if (user && user._id) {
        try {
          const fetchedPasswordData = await fetchUserPassword(user._id);
          setUserData((prevData) => ({
            ...prevData,
            password:
              fetchedPasswordData.tempPassword || "Password not available",
          }));
        } catch (error) {
          setError("Error loading user password");
        }
      }
    };

    getUserPassword();
  }, [user]);

  // Hàm để xuất dữ liệu người dùng thành PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    // const font = doc.getFontList().getFont("Roboto"); // Use an existing font as a base
    const robotoFont = doc.addFont(`${process.env.REACT_APP_URL}/Roboto-Regular.ttf`, "Roboto"); // Add downloaded font
  
    // Set font size and style
    doc.setFontSize(12);
    doc.setFont(robotoFont, "normal"); // Use the downloaded font with normal style
  
    doc.text("User Details", 14, 16);

    doc.autoTable({
      startY: 22,
      head: [["Field", "Value"]],
      body: [
        ["Full Name", `${userData.firstName} ${userData.lastName}`],
        ["Email", userData.email],
        ["Username", userData.username],
        ["Address", userData.address],
        ["Status", userData.status],
        ["Contact Number", userData.contactNumber],
        ["Password", userData.password],
      ],
      margin: { top: 22 },
      styles: { fontSize: 10 },
    });

    doc.save("details_pass.pdf");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!userData) return <div>No user data available</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-800 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg w-full max-w-md px-6 py-8">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          User Details
        </h2>
        <ul className="list-none mt-6 space-y-4">
          {[
            {
              label: "Full Name",
              value: `${userData.firstName} ${userData.lastName}`,
            },
            { label: "Username", value: userData.username },
            { label: "Email", value: userData.email },
            { label: "Address", value: userData.address },
            { label: "Status", value: userData.status },
            { label: "Contact Number", value: userData.contactNumber },
            { label: "Password", value: userData.password },
            // Omit password for security reasons
          ].map(({ label, value }) => (
            <li
              key={label}
              className="flex justify-between items-center text-stone-700 dark:text-stone-300">
              <span className="truncate">{label}</span>
              <span className="text-sm">{value}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            Export PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPassword;
