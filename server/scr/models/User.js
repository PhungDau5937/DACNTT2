  const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, //
    role: { type: String, enum: ["Head", "Teacher", "Student"], required: true },
    password: { type: String, required: true },
    passwordChanged: { type: Boolean, default: false },
    email: { type: String, default: "", required: false },
    lastName: { type: String, required: true }, //
    firstName: { type: String, required: true }, //
    dateOfBirth: { type: Date, default: null }, // Thêm trường ngày sinh
    status: { type: String, enum: ["active", "locked", "completed"], default: "active" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
      default: "Other",
    },
    avatar: { type: String, default: "" },
    address: { type: String, default: "" },
    contactNumber: { type: String, sparse: true, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });


  userSchema.pre("save", function (next) {
    if (this.email && !/^\S+@\S+\.\S+$/.test(this.email)) {
      const err = new Error("Invalid email format");
      err.name = "ValidationError";
      return next(err);
    }
    next();
  });

  const User = mongoose.model("User", userSchema);

  module.exports = User;
