import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { BlacklistedToken } from '../models/BlacklistedToken.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(409).json({ message: 'User already exists.' });

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });
  const isBlacklisted = await BlacklistedToken.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }

  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await BlacklistedToken.create({ token, expiresAt });

  res.status(200).json({ message: 'Logout successful.' });
};

