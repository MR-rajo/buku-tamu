const db = require("../config/database");
const { saveBase64Image } = require("../utils/imageHelper");
const { sendWhatsAppMessage } = require("../utils/whatsapp");

// Get form buku tamu
const getForm = async (req, res) => {
  try {
    // Ambil data sekolah untuk dropdown
    const [sekolahList] = await db.query(
      "SELECT id, nama_sekolah FROM master_sekolah ORDER BY nama_sekolah ASC"
    );

    res.render("buku-tamu/form", {
      title: "Buku Tamu Digital - HUT Yayasan",
      sekolahList,
      success: req.query.success || null,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("error", {
      title: "Error",
      error: { message: "Terjadi kesalahan saat memuat halaman" },
    });
  }
};

// Function untuk generate kode otomatis
const generateKode = (namaLengkap) => {
  // Ambil inisial dari nama (huruf depan setiap kata)
  const words = namaLengkap.trim().split(/\s+/);
  const inisial = words.map((word) => word.charAt(0).toUpperCase()).join("");

  return inisial;
};

// Submit buku tamu
const submitForm = async (req, res) => {
  try {
    const { sekolah_id, other_instansi, nama_lengkap, nomor_wa, foto } =
      req.body;

    // Validasi input
    if (!sekolah_id || !nama_lengkap || !nomor_wa || !foto) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi!",
      });
    }

    // Convert base64 to file path
    const fotoPath = await saveBase64Image(foto);

    if (!fotoPath) {
      return res.status(400).json({
        success: false,
        message: "Gagal menyimpan foto. Silakan coba lagi.",
      });
    }

    // Insert data ke database terlebih dahulu (tanpa kode, dengan path foto)
    const [result] = await db.query(
      "INSERT INTO buku_tamu (sekolah_id, other_instansi, nama_lengkap, nomor_wa, foto) VALUES (?, ?, ?, ?, ?)",
      [sekolah_id, other_instansi || null, nama_lengkap, nomor_wa, fotoPath]
    );

    // Ambil ID yang baru saja di-insert
    const newId = result.insertId;

    // Generate inisial dari nama
    const inisial = generateKode(nama_lengkap);

    // Format kode: [Inisial][01][ID 2 digit]
    // Contoh: Dimas Putra dengan ID 5 → DP0105
    const kode = `${inisial}01${newId.toString().padStart(2, "0")}`;

    // Update kode berdasarkan ID
    await db.query("UPDATE buku_tamu SET kode = ? WHERE id = ?", [kode, newId]);

    // Kirim pesan WhatsApp (non-blocking)
    // Jangan biarkan error WhatsApp menghentikan proses utama
    sendWhatsAppMessage(nomor_wa, nama_lengkap, kode)
      .then((result) => {
        if (result.success) {
          console.log(
            `✅ WhatsApp notification sent to ${nama_lengkap} (${result.number})`
          );
        } else {
          console.warn(
            `⚠️ Failed to send WhatsApp to ${nama_lengkap}: ${result.message}`
          );
        }
      })
      .catch((error) => {
        console.error(
          `❌ WhatsApp error for ${nama_lengkap}: ${error.message}`
        );
      });

    res.json({
      success: true,
      message: "Terima kasih! Data Anda telah tersimpan.",
      kode: kode,
      nama_lengkap: nama_lengkap,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menyimpan data",
    });
  }
};

// Halaman sukses
const successPage = (req, res) => {
  const kode = req.query.kode || null;
  const nama = req.query.nama || null;

  res.render("buku-tamu/success", {
    title: "Terima Kasih - Buku Tamu Digital",
    kode: kode,
    nama_lengkap: nama,
  });
};

module.exports = {
  getForm,
  submitForm,
  successPage,
};
