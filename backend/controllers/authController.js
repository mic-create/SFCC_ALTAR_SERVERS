/* backend/src/controllers/authController.js */
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required.' 
      });
    }

    // 1. Normalize input email
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Query user with LOWER(email) comparison
    const result = await pool.query(
      'SELECT id, name, email, password_hash, role, is_active FROM users WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    // Diagnostic log (SAFE: No secrets/hashes printed)
    console.log(`[AUTH CHECK] Email: ${normalizedEmail} | Found: ${result.rows.length > 0}`);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const user = result.rows[0];

    // 3. Check account active status
    if (!user.is_active) {
      console.log(`[AUTH CHECK] User ${normalizedEmail} is inactive.`);
      return res.status(403).json({ 
        success: false, 
        message: 'Account is deactivated. Please contact an administrator.' 
      });
    }

    // 4. Secure Bcrypt comparison
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    // Diagnostic log (SAFE: Boolean result only)
    console.log(`[AUTH CHECK] Bcrypt match: ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // 5. Generate JWT Token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    // 6. Return success payload
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('[AUTH ERROR]:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};