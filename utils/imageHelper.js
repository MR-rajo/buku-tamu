const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * Helper function untuk mengkonversi base64 ke file gambar
 * @param {string} base64String - String base64 dari foto
 * @returns {string|null} - Path relatif file yang disimpan atau null jika gagal
 */
const decodeAndSaveBase64 = (base64String) => {
  try {
    // Validasi input
    if (!base64String || base64String === null || base64String === "null") {
      console.warn("Base64 string is null or empty");
      return null;
    }

    // Cek apakah sudah berupa path file (sudah dimigrasi)
    if (
      base64String.startsWith("/uploads/") ||
      base64String.startsWith("uploads/")
    ) {
      console.log("Already a file path:", base64String);
      return base64String;
    }

    // Cek apakah string adalah base64 yang valid
    if (!base64String.includes("base64,")) {
      console.warn("Not a valid base64 string");
      return null;
    }

    // Ekstraksi mime type dan data base64
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      console.error("Invalid base64 format");
      return null;
    }

    const mimeType = matches[1]; // e.g., 'image/jpeg', 'image/png'
    const base64Data = matches[2];

    // Tentukan ekstensi file berdasarkan mime type
    let extension = "jpg"; // default
    if (mimeType.includes("png")) {
      extension = "png";
    } else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
      extension = "jpg";
    } else if (mimeType.includes("gif")) {
      extension = "gif";
    } else if (mimeType.includes("webp")) {
      extension = "webp";
    }

    // Generate nama file unik: timestamp_randomstring.ext
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const filename = `${timestamp}_${randomString}.${extension}`;

    // Path direktori dan file
    const uploadDir = path.join(__dirname, "..", "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // Buat direktori jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Upload directory created:", uploadDir);
    }

    // Decode base64 dan simpan file
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    console.log("Image saved successfully:", filename);

    // Return path relatif untuk disimpan di database
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error in decodeAndSaveBase64:", error.message);
    return null;
  }
};

/**
 * Helper function untuk menyimpan base64 dari form submission
 * Digunakan saat tamu baru submit form
 */
const saveBase64Image = async (base64String) => {
  return decodeAndSaveBase64(base64String);
};

module.exports = {
  decodeAndSaveBase64,
  saveBase64Image,
};
