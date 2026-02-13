const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.ownerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM owners WHERE username=?',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ msg: 'Owner not found' });
    }

    const owner = rows[0];

    const match = await bcrypt.compare(password, owner.password);

    if (!match) {
      return res.status(401).json({ msg: 'Wrong password' });
    }

    const token = jwt.sign(
      { ownerId: owner.id, role: 'owner' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      owner: {
        id: owner.id,
        username: owner.username,
        email: owner.email,
        full_name: owner.full_name
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Owner login error' });
  }
};
