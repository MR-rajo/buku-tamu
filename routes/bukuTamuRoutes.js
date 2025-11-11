const express = require("express");
const router = express.Router();
const bukuTamuController = require("../controllers/bukuTamuController");

// Route untuk halaman form
router.get("/", bukuTamuController.getForm);

// Route untuk submit form
router.post("/submit", bukuTamuController.submitForm);

// Route untuk halaman sukses
router.get("/success", bukuTamuController.successPage);

module.exports = router;
