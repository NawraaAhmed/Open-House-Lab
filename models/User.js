const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 20,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
  },
  { timestamps: true },
);

// model
const User = mongoose.model("User", userSchema);

// export the model
module.exports = User;
