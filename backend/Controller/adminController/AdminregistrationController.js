const jwt = require("jsonwebtoken");
const Admin = require("../../Models/adminModel/admin");
const { secretKey } = require("../../Config/Config");
const bcrypt = require("bcrypt");

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register admin
const registerAdmin = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "Admin with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();
    res
      .status(201)
      .json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login controller function

const LoginController = async (req, res) => {
  const { email, password } = req.body;
  const secretKeys = secretKey;

  try {
    // Check if admin exists
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Validate password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { email: user.email, role: "admin" },
      secretKeys,
      { expiresIn: "30d" } // Using 30d for more readable format
    );

    // Set HTTP cookie with JWT token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  LoginController,
  registerAdmin,
  deleteAdmin,
  getAllAdmins,
};
