const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const publicKey = fs.readFileSync(path.join(__dirname, '../keys/public.pem'));

function authenticateToken(req, res, next) {
  /* If reading from Auth Headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; */

  // If reading from cookie
  // console.log("Cookie value from the token", req.cookies);
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authorizeAdmin(req, res, next) {
  // console.log("Logged in user role", req.user);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
}

function authorizeAudit(req, res, next) {
  // console.log("Logged in user role", req.user);
  if (req.user.role !== 'audit') {
    return res.status(403).json({ message: 'Access denied. Audit only.' });
  }
  next();
}

function authorizeAdminOrAudit(req, res, next) {
  const role = req.user.role;
  if (role !== 'admin' && role !== 'audit') {
    return res.status(403).json({ message: 'Access denied. Admin or Audit only.' });
  }
  next();
}

module.exports = {
  authenticateToken,
  authorizeAdmin,
  authorizeAudit,
  authorizeAdminOrAudit
};
