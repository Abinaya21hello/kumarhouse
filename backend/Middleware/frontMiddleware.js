// authMiddleware.js

const jwt = require('jsonwebtoken');
const userModel = require("../Models/userModel/User");

// const adminModel = require('../models/adminModel/AdminregisterModel')

const { secretKey } = require("../Config/Config");

const authfront = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ message: 'No access token provided' });
    }

    jwt.verify(accessToken, secretKey, async (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Invalid access token' });
      }

      try {
        const user = await userModel.findOne({ email: decoded.email }).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
      } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { authfront };