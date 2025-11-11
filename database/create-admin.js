/**
 * Script untuk membuat password hash untuk admin
 * Jalankan dengan: node database/create-admin.js
 */

const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n=== BUAT PASSWORD HASH UNTUK ADMIN ===\n");

rl.question("Masukkan password yang ingin di-hash: ", async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("\n✅ Password berhasil di-hash!");
    console.log("Hash Password: ", hashedPassword);
    console.log(
      "\nGunakan hash ini untuk kolom password di tabel super_admin\n"
    );

    // Contoh query
    console.log("Contoh Query SQL:");
    console.log(
      `INSERT INTO super_admin (name, whatsapp, password) VALUES ('admin', '081234567890', '${hashedPassword}');`
    );
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  rl.close();
});
