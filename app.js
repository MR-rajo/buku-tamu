const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { initializeClient } = require("./utils/whatsapp");

const app = express();
const PORT = process.env.PORT || 1000;

// Middleware - Increased limit for base64 images
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "buku_tamu_secret_key_2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Flash message middleware (simple implementation using session)
app.use((req, res, next) => {
  res.locals.flash = {
    success: req.session.flashSuccess || null,
    error: req.session.flashError || null,
  };
  // Clear flash messages after displaying
  delete req.session.flashSuccess;
  delete req.session.flashError;
  next();
});

// Make session data available to all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  next();
});

// Routes
const bukuTamuRoutes = require("./routes/bukuTamuRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/buku-tamu", bukuTamuRoutes);
app.use("/admin", adminRoutes);

// Root redirect
app.get("/", (req, res) => {
  res.redirect("/buku-tamu");
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Halaman Tidak Ditemukan" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Initialize WhatsApp Client
initializeClient();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📝 Buku Tamu: http://localhost:${PORT}/buku-tamu`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
});
