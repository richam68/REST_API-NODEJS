const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please add a user name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email address"],
      unique: [true, "Email address already taken"], // Ensures that email is unique
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
      minlength: 6, // Minimum length for password
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
