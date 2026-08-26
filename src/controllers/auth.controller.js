const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.forgetPassword = (req, res) => {
  const { email, phonenumber, password, confirmPassword } = req.body;
  const identifier = email || phonenumber;

  if (!identifier || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Email or phone number, password, and confirm password are required' });
  }

  if (phonenumber) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phonenumber)) {
      return res.status(400).json({ message: 'Invalid phone number. It must be exactly 10 digits.' });
    }
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (password.length > 10) {
    return res.status(400).json({ message: 'Password must not exceed 10 characters' });
  }

  // Check if user exists before updating
  const checkQuery = 'SELECT * FROM users WHERE email = ? OR phonenumber = ?';
  db.query(checkQuery, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateQuery = 'UPDATE users SET password = ? WHERE email = ? OR phonenumber = ?';

      db.query(updateQuery, [hashedPassword, identifier, identifier], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ message: 'Failed to update password' });
        }
        res.status(200).json({ message: 'Password updated successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};
