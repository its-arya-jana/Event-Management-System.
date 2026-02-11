const authenticateUser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized: Please log in' });
  }
};

const authenticateAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    req.user = req.session.user;
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin
};