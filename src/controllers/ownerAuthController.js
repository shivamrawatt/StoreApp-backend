const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


/* ============================
   OWNER REGISTER
============================ */

exports.ownerRegister = async (req, res) => {
  try {

    const { username, email, full_name, password } = req.body;

    const [exist] = await db.query(
      'SELECT id FROM owners WHERE username=? OR email=?',
      [username, email]
    );

    if (exist.length) {
      return res.status(400).json({ msg: 'Owner already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO owners
      (username,email,password,full_name)
      VALUES (?,?,?,?)`,
      [username, email, hashed, full_name]
    );

    res.json({ msg: 'Owner registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Owner register error' });
  }
};



/* ============================
   OWNER LOGIN
============================ */

exports.ownerLogin = async (req, res) => {
  try {

    const { username, password } = req.body;

    console.log("Entered password:", password);
    console.log("Entered length:", password.length);

    const [rows] = await db.query(
      'SELECT * FROM owners WHERE username=?',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ msg: 'Owner not found' });
    }

    const owner = rows[0];

    console.log("Stored hash:", owner.password);
    console.log("Stored hash length:", owner.password.length);

    const match = await bcrypt.compare(password, owner.password);

    console.log("MATCH RESULT:", match);

    if (!match) {
      return res.status(401).json({ msg: 'Wrong password' });
    }

    const token = jwt.sign(
      {
        ownerId: owner.id,
        role: 'owner'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

   res.json({
  token,
  user: {
    id: owner.id,
    role: 'owner'
  }
});
;

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Owner login error' });
  }
};

