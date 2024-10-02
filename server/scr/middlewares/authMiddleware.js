
///Users/tienphat/Code/DACNTT_2_BankExamEnglish/server/scr/middlewares/authMiddleware.js
require('dotenv').config()
const jwt = require("jsonwebtoken");
const secret_jwt = process.env.SECRET_JWT;

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret_jwt, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
// userSchema.pre('save', async function(next) {
//   if (this.isNew) {
//       this.id = generateUserId(this.role); // Tạo ID dựa trên vai trò
//       if (this.role === 'Head') {
//           this.password = generateRandomPassword(); // Tạo mật khẩu ngẫu nhiên cho Head
//       }
//   }

//   if (this.isModified('password')) {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//       this.isPasswordDefault = false; // Đánh dấu là mật khẩu không còn mặc định
//   }

//   this.CreateAt = Date.now();
//   next();
// });



// Middleware để kiểm tra vai trò người dùng
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập vào tài nguyên này" });
    }
    next();
  };
};
