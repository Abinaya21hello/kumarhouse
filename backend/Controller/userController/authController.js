const jwt = require("jsonwebtoken");
const userModel = require("../../Models/userModel/User");
const { secretKey } = require("../../Config/Config");

const verifyTokenController = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ valid: false, message: "No access token provided" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ valid: false, message: "No access token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await userModel.findOne({ email: decoded.email }).select("-password");
    if (!user) {
      return res.status(404).json({ valid: false, message: "User not found" });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
    };

    return res.status(200).json({ valid: true, user: userData });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ valid: false, message: "Invalid access token" });
  }
};

module.exports = { verifyTokenController };