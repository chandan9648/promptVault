import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

//REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || name.length < 2) return res.status(400).json({ message: 'Name required (min 2)' });
    const emailOk = typeof email === 'string' && /.+@.+\..+/.test(email);
    if (!emailOk) return res.status(400).json({ message: 'Valid email required' });
    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password min length 6' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

//LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const emailOk = typeof email === 'string' && /.+@.+\..+/.test(email);
    if (!emailOk || !password) return res.status(400).json({ message: 'Invalid input' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};
