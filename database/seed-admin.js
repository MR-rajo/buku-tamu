/**
 * Migration Script: Insert Super Admin
 * Jalankan dengan: node database/seed-admin.js
 *
 * Data yang akan diinsert:
 * - Name: Super Admin
 * - WhatsApp: 081935679330
 * - Password: 1234 (akan di-hash otomatis)
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

// Function to load .env file manually
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  const env = {};

  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const lines = envContent.split("\n");

      lines.forEach((line) => {
        line = line.trim();
        // Skip empty lines and comments
        if (!line || line.startsWith("#")) return;

        const [key, ...valueParts] = line.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim();
          env[key.trim()] = value;
        }
      });

      console.log("✅ File .env berhasil dibaca");
    } else {
      console.log("⚠️  File .env tidak ditemukan, menggunakan default values");
    }
  } catch (error) {
    console.log("⚠️  Error membaca .env:", error.message);
    console.log("   Menggunakan default values");
  }

  return env;
}

// Load environment variables
const env = loadEnv();

// Data super admin yang akan diinsert
const ADMIN_DATA = {
  name: "Super Admin",
  whatsapp: "081935679330",
  password: "1234", // Password plain text (akan di-hash)
};

async function seedAdmin() {
  let connection;

  try {
    console.log("\n=== 🚀 MIGRATION: INSERT SUPER ADMIN ===\n");

    // Create database connection
    connection = await mysql.createConnection({
      host: env.DB_HOST || "localhost",
      user: env.DB_USER || "root",
      password: env.DB_PASSWORD || "",
      database: env.DB_NAME || "buku_tamu",
      port: env.DB_PORT || 3306,
    });

    console.log("✅ Koneksi database berhasil");

    // Check apakah admin sudah ada
    const [existingAdmin] = await connection.execute(
      "SELECT id, name, whatsapp FROM super_admin WHERE whatsapp = ?",
      [ADMIN_DATA.whatsapp]
    );

    if (existingAdmin.length > 0) {
      console.log("\n⚠️  Super Admin dengan WhatsApp ini sudah ada:");
      console.log(`   ID: ${existingAdmin[0].id}`);
      console.log(`   Name: ${existingAdmin[0].name}`);
      console.log(`   WhatsApp: ${existingAdmin[0].whatsapp}`);
      console.log("\n❌ Migration dibatalkan (data sudah ada)\n");
      return;
    }

    // Hash password
    console.log("\n🔐 Hashing password...");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(ADMIN_DATA.password, saltRounds);
    console.log("✅ Password berhasil di-hash");

    // Insert super admin
    console.log("\n📝 Inserting super admin data...");
    const [result] = await connection.execute(
      `INSERT INTO super_admin (name, whatsapp, password, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [ADMIN_DATA.name, ADMIN_DATA.whatsapp, hashedPassword]
    );

    console.log("✅ Super Admin berhasil ditambahkan!");
    console.log("\n📊 Detail Data:");
    console.log(`   ID: ${result.insertId}`);
    console.log(`   Name: ${ADMIN_DATA.name}`);
    console.log(`   WhatsApp: ${ADMIN_DATA.whatsapp}`);
    console.log(`   Password: ${ADMIN_DATA.password} (sudah di-hash)`);
    console.log(`   Created: NOW()`);

    // Verify data
    const [verifyData] = await connection.execute(
      "SELECT id, name, whatsapp, created_at FROM super_admin WHERE id = ?",
      [result.insertId]
    );

    if (verifyData.length > 0) {
      console.log("\n✅ Verifikasi: Data berhasil tersimpan di database");
      console.log("   Created At:", verifyData[0].created_at);
    }

    console.log("\n🎉 Migration selesai!\n");
    console.log("📌 Login credentials:");
    console.log(`   WhatsApp: ${ADMIN_DATA.whatsapp}`);
    console.log(`   Password: ${ADMIN_DATA.password}`);
    console.log("\n");
  } catch (error) {
    console.error("\n❌ Error saat migration:");
    console.error("   Message:", error.message);

    if (error.code === "ER_NO_SUCH_TABLE") {
      console.error("\n💡 Solusi: Jalankan schema.sql terlebih dahulu");
      console.error("   mysql -u root -p buku_tamu < database/schema.sql\n");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("\n💡 Solusi: Buat database terlebih dahulu");
      console.error("   CREATE DATABASE buku_tamu;\n");
    } else if (error.code === "ECONNREFUSED") {
      console.error("\n💡 Solusi: Pastikan MySQL/MariaDB sudah running\n");
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Koneksi database ditutup\n");
    }
  }
}

// Run migration
seedAdmin();
