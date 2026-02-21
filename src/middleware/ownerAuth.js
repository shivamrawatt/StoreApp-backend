const jwt = require('jsonwebtoken');

module.exports = function ownerAuth(req, res, next) {

  try {

    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const token = header.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== 'owner') {
      return res.status(403).json({ msg: 'Owner only access' });
    }

    req.ownerId = decoded.ownerId;

    next();

  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }

};
