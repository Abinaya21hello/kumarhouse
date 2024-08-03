const nodemailer = require("nodemailer");
const crypto = require("crypto");

// In-memory store for OTPs and user data
const otpStore = new Map();
const userDataStore = new Map();

// Generate a random OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kumarherbals05@gmail.com",
    pass: "gamn itxl ovjx ncwj", // app password key
  },
});

// Function to send OTP via email
const sendOtp = async (email, userData) => {
  try {
    const otp = generateOtp();

    // Store OTP and user data in memory with expiration time
    otpStore.set(email, { otp, expires: Date.now() + 15 * 60 * 1000 }); // OTP expires in 15 mins

    userDataStore.set(email, userData);

    const mailOptions = {
      from: "kumarherbals05@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 15 mins.`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Error sending OTP. Please try again.");
  }
};

// Function to verify OTP and return user data
const verifyOtp = async (email, otp) => {
  try {
    const otpData = otpStore.get(email);

    if (!otpData) {
      throw new Error("OTP not found");
    }

    if (otpData.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    if (Date.now() > otpData.expires) {
      throw new Error("OTP has expired");
    }

    // Retrieve user data and clear OTP and user data from store after successful verification
    const userData = userDataStore.get(email);
    otpStore.delete(email);
    userDataStore.delete(email);

    return userData;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Error verifying OTP. Please try again.");
  }
};

module.exports = { sendOtp, verifyOtp };
