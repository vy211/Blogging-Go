const User = require("../Models/User.js");
const jwt = require("jsonwebtoken");

// Login function
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (userDoc && password === userDoc.password) {
      const payload = { username, id: userDoc._id };
      jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) {
          throw err;
        } else {
          res.cookie("token", token).json({
            id: userDoc._id,
            username,
          });
        }
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (error) {
    res.json({ msg: error });
  }
};

// Logout function
const logout = (req, res) => {
  res.cookie("token", "").json("ok");
};

// Register function
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      const userDoc = await User.create({ username, password });
      res.json(userDoc);
    } else {
      res.json({ message: "User Already exists!" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { login, logout, register };
