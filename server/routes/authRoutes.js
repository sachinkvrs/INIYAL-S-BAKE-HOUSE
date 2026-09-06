import express from 'express';
import db from '../db.js';
import { generateToken, verifyTokenMiddleware, comparePasswords, hashPassword } from '../auth.js';

const router = express.Router();

// Admin Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email.trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = comparePasswords(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Verify Current Session
router.get('/me', verifyTokenMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// Update Profile or Password
router.put('/profile', verifyTokenMiddleware, (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to set a new password' });
    }
    if (!comparePasswords(currentPassword, user.password_hash)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    const newHash = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, user.id);
  }

  if (name || email) {
    db.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?')
      .run(name ? name.trim() : null, email ? email.trim() : null, user.id);
  }

  const updated = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(user.id);
  res.json({ message: 'Profile updated successfully', user: updated });
});

export default router;
