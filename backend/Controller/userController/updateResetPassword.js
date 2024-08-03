const bcrypt = require("bcrypt");
const userModel = require("../../Models/userModel/User");
const Token = require("../../Models/userModel/Token");

const UpdateResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { userId, tokenId } = req.params;

  try {
    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Both password fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Invalid link or expired" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: tokenId,
    });
    if (!token) {
      return res.status(404).json({ error: "Invalid link or expired" });
    }

    // Check if token is expired
    if (token.expires < new Date()) {
      await token.deleteOne();
      return res.status(400).json({ error: "Reset link has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    await token.deleteOne();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in UpdateResetPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  UpdateResetPassword,
};
