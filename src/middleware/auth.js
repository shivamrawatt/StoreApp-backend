/*const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET, 
    );

    // ⭐ ATTACH TO REQUEST
    req.userId = decoded.id;
    req.role = decoded.role;
    req.shopId = decoded.shopId;

    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};*/




const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ✅ attach individual fields
    req.userId = decoded.id;
    req.role = decoded.role;
    req.shopId = decoded.shopId;

    // ✅ also attach full user object (controllers expect this)
    req.user = {
      id: decoded.id,
      role: decoded.role,
      shopId: decoded.shopId,
    };

    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
