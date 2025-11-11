// Middleware untuk proteksi route admin
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect("/admin/login");
};

// Middleware untuk redirect jika sudah login
const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect("/admin/dashboard");
  }
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
};
