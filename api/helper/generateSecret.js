const crypto = require("crypto");

const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString("hex");
};
const newSecret = generateJWTSecret();
console.log(newSecret);
