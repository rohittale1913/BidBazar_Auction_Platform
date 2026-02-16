const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "auction-platform-secret-key-2026";
const JWT_EXPIRES_IN = "7d";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = { JWT_SECRET, generateToken };
