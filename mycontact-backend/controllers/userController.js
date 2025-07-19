const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Import the User model
const UserModel = require("../models/userModel");

//@desc Register a new user
//@route POST /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;
  // Check if all fields are provided
  if (!email || !password || !userName) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  //Check already user is existied -- ?
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  //bycrpt the password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create a new user
  const userData = await UserModel.create({
    userName,
    email,
    password: hashedPassword,
  });
  // if user is created successfully then send response: no need to send password as response
  if (userData) {
    res.status(201).json({
      _id: userData.id,
      email: userData.email,
      userName: userData.userName,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@desc Login user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check if all fields are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  // Check if user exists: find in the database
  const user = await UserModel.findOne({
    email,
  });

  //we need to compare the password with the already stored hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          userName: user.userName,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
        // expiresIn: "30d", // Token will expire in 30 days
      }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password is not valid");
  }

  res.json({ message: "Login user" });
});

//@desc Get current user data
//@route GET /api/users/current
//@access Private

const currentUser = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, currentUser };
