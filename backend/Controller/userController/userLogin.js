const jwt = require("jsonwebtoken");
const userModel = require("../../Models/userModel/User");
const bcrypt = require("bcrypt");
const secretToken = require("../../Config/Config");

const LoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Password incorrect" });
    }

    // Create JWT token
    const token = jwt.sign(
      { email: user.email, role: "user" },
      secretToken.secretKey,
      {
        expiresIn: 2592000, // Set the expiration time to 30 days
      }
    );

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
    };

    return res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        user: userData,
        token,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//logout
const LogoutController = (req, res) => {
  try {
    res
      .status(200)
      .cookie("accessToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(0),
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { LoginController, LogoutController };
