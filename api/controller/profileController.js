const jwt = require("jsonwebtoken");

// Profile function
const getProfile = async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) {
      res.status(401).json({ error: "Invalid or expired token" });
    } else {
      console.log("Token is verified");
      res.json(info);
    }
  });
};

module.exports = { getProfile };
