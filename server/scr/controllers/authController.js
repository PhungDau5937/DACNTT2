const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../../config/mail");
const Chat = require("../models/Chat");
const secret_jwt = process.env.SECRET_JWT;
const getCurrentSemester = require("../middlewares/getCurrentSemester.js");

exports.login = async (req, res) => {
  const { username, password, role } = req.body; // Thêm role vào body của yêu cầu

  try {
    // Tìm người dùng dựa trên Username và vai trò
    let user = await User.findOne({ username, role });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Lấy thông tin học kỳ hiện tại
    // const currentSemester = await getCurrentSemester();

    // Tạo JWT token và thêm role vào payload
    const payload = {
      user: {
        id: user.id,
        user: user.user,
        role: user.role, // Thêm role vào token payload
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET_JWT, // Thay thế bằng secret key thực tế của bạn
      { expiresIn: "3d" }, // Tuổi thọ của token
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Trả về token cho client
      }
    );
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send("Server error");
  }
};

exports.profile = async (req, res) => {
  try {
    const userId = req.params.id; // Lấy userId từ tham số URL
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Tìm người dùng dựa trên _id
    const profile = await User.findById(userId).select("-password"); // Loại bỏ mật khẩu khỏi kết quả

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin profile người dùng
    res.json(profile);
    // console.log("User profile: ", profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.publicProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Lấy userId từ tham số URL
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Tìm người dùng dựa trên _id
    const profile = await User.findById(userId).select("-password"); // Loại bỏ mật khẩu khỏi kết quả

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin profile người dùng
    res.json(profile);
    // console.log("User profile: ", profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Tìm người dùng theo userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới và đổi passwordChanged thành true
    user.password = hashedPassword;
    user.passwordChanged = true;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editProfile = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email, dateOfBirth, gender, address, contactNumber } = req.body;

  try {
    // Tìm và cập nhật thông tin người dùng
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cập nhật các trường chỉ nếu chúng không phải là chuỗi rỗng
    if (dateOfBirth !== '') user.dateOfBirth = dateOfBirth;
    if (gender !== '') user.gender = gender;
    if (address !== '') user.address = address;
    if (contactNumber !== '') user.contactNumber = contactNumber;

    // Cập nhật ngày chỉnh sửa thành ngày hiện tại
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



let resetCodes = {}; // Sử dụng Redis hoặc cơ sở dữ liệu thực sự cho sản phẩm thực tế
let verificationCodes = {};
exports.sendResetCode = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const resetCode = crypto.randomInt(100000, 999999).toString();
    resetCodes[email] = resetCode;

    const mailOptions = {
      from: "englishgoforschool@gmail.com",
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Failed to send reset code");
      }
      res.status(200).send("Reset code sent");
    });
  } catch (error) {
    console.error("Error in sendResetCode:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Xác thực mã xác thực
exports.verifyResetCode = (req, res) => {
  const { email, code } = req.body;
  if (resetCodes[email] && resetCodes[email] === code) {
    res.status(200).send("Code verified");
  } else {
    res.status(400).send("Invalid code");
  }
};

// Đặt lại mật khẩu

exports.resetPassword = async (req, res) => {
  const { email, newPassword} = req.body;
  console.log(username)

  console.log("Received reset request:", { email, newPassword });

  try {
    // Tìm người dùng dựa trên email
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    // Băm mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordChanged = true;

    // Lưu thay đổi vào cơ sở dữ liệu
    const updatedUser = await user.save();

    if (!updatedUser) {
      console.error("Error saving updated user");
      return res.status(500).send("Error saving updated user");
    }

    console.log("Password reset successfully");
    res.status(200).send("Password reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).send("Internal Server Error");
  }
};





exports.sendVerificationCode = async (req, res) => {
  const { userId, email } = req.body; // Lấy userId từ req.body
  try {
    const user = await User.findOne({ _id: userId }); // Tìm user theo userId
    if (!user) {
      return res.status(404).send("User not found");
    }

    const resetCode = crypto.randomInt(100000, 999999).toString();
    verificationCodes[email] = resetCode; // Lưu mã xác thực với email

    const mailOptions = {
      from: "englishgoforschool@gmail.com",
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${resetCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Failed to send verification code");
      }
      res.status(200).send("Verification code sent");
    });
  } catch (error) {
    console.error("Error in sendVerificationCode:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.verifyEmailCode = async (req, res) => {
  console.log('Verify Email Code Request:', req.body); // Kiểm tra dữ liệu đầu vào
  const { userId, email, code } = req.body;

  if (!email || !code) {
    return res.status(400).send("Email and code must be provided");
  }

  // Kiểm tra nếu `verificationCodes` có trường `email` và mã khớp
  if (verificationCodes[email] && verificationCodes[email] === code) {
    delete verificationCodes[email]; // Xóa mã xác thực sau khi xác minh thành công

    try {
      // Cập nhật bảng user để thêm email
      const result = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { email: email } },
        { new: true }, // Return the updated document
      );

      if (!result) {
        return res.status(404).send("User not found");
      }

      res.status(200).send("Email verified and updated");
    } catch (error) {
      console.error('Error updating email:', error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.status(400).send("Invalid code");
  }
};





// Fetch messages from MongoDB
exports.getMessage = async (req, res) => {
  const { page = 1, limit = 30 } = req.query;

  try {
    const messages = await Chat.find({ room: "common" })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("sender", "firstName lastName role avatar"); // Populate sender với firstName, lastName, role, và avatar

    res.status(200).json(messages.reverse()); // Đảo ngược mảng để có thứ tự thời gian tăng dần
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { sender, message } = req.body;

    if (!sender || !message) {
      return res.status(400).json({ message: "Sender and message are required." });
    }

    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res.status(404).json({ message: "Sender not found." });
    }

    const newMessage = new Chat({
      room: "common",
      sender, // Lưu ObjectId của sender
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};
