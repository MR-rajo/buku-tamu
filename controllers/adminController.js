const db = require("../config/database");
const bcrypt = require("bcrypt");
const xlsx = require("xlsx");
const { decodeAndSaveBase64 } = require("../utils/imageHelper");
const {
  getClientStatus,
  getQRCode,
  logoutClient,
} = require("../utils/whatsapp");

// GET Login page
const getLogin = (req, res) => {
  // If user is already logged in and not accessing with success parameter, redirect to dashboard
  if (req.session.isAuthenticated && !req.query.success) {
    return res.redirect("/admin/dashboard");
  }

  // If this is a success redirect (after successful login), show toast and redirect to dashboard
  if (req.session.isAuthenticated && req.query.success === "login") {
    req.session.flashSuccess = "Login berhasil! Selamat datang kembali.";
    // Redirect to dashboard after setting flash message
    return res.redirect("/admin/dashboard");
  }

  res.render("admin/login", {
    title: "Login Admin - Buku Tamu Digital",
    error: null,
  });
};

// POST Login
const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.render("admin/login", {
        title: "Login Admin - Buku Tamu Digital",
        error: "Username dan password harus diisi!",
      });
    }

    // Cari user di database - bisa pakai name ATAU whatsapp
    const [users] = await db.query(
      "SELECT * FROM super_admin WHERE name = ? OR whatsapp = ?",
      [username, username]
    );

    if (users.length === 0) {
      return res.render("admin/login", {
        title: "Login Admin - Buku Tamu Digital",
        error: "Username atau password salah!",
      });
    }

    const user = users[0];

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.render("admin/login", {
        title: "Login Admin - Buku Tamu Digital",
        error: "Username atau password salah!",
      });
    }

    // Set session
    req.session.isAuthenticated = true;
    req.session.user = {
      id: user.id,
      name: user.name,
      whatsapp: user.whatsapp,
    };

    // Redirect to login with success parameter to show toast notification
    res.redirect("/admin/login?success=login");
  } catch (error) {
    console.error("Error login:", error);
    res.render("admin/login", {
      title: "Login Admin - Buku Tamu Digital",
      error: "Terjadi kesalahan server. Silakan coba lagi.",
    });
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logout:", err);
    }
    res.redirect("/admin/login");
  });
};

// Dashboard
const getDashboard = async (req, res) => {
  try {
    // Get total tamu hari ini
    const [todayCount] = await db.query(
      "SELECT COUNT(*) as count FROM buku_tamu WHERE DATE(created_at) = CURDATE()"
    );

    // Get total tamu keseluruhan
    const [totalCount] = await db.query(
      "SELECT COUNT(*) as count FROM buku_tamu"
    );

    // Get total sekolah
    const [schoolCount] = await db.query(
      "SELECT COUNT(*) as count FROM master_sekolah"
    );

    // Get statistik per sekolah (jumlah tamu per sekolah)
    const [schoolStats] = await db.query(`
      SELECT 
        ms.id,
        ms.nama_sekolah,
        COUNT(bt.id) as jumlah_tamu,
        MAX(bt.created_at) as last_visit
      FROM master_sekolah ms
      LEFT JOIN buku_tamu bt ON ms.id = bt.sekolah_id
      GROUP BY ms.id, ms.nama_sekolah
      ORDER BY jumlah_tamu DESC, ms.nama_sekolah ASC
    `);

    // Get recent guests (5 terbaru)
    const [recentGuests] = await db.query(`
            SELECT bt.*, ms.nama_sekolah 
            FROM buku_tamu bt
            LEFT JOIN master_sekolah ms ON bt.sekolah_id = ms.id
            ORDER BY bt.created_at DESC
            LIMIT 5
        `);

    res.render("admin/dashboard", {
      title: "Dashboard Admin",
      currentPage: "dashboard",
      stats: {
        today: todayCount[0].count,
        total: totalCount[0].count,
        schools: schoolCount[0].count,
      },
      schoolStats,
      recentGuests,
    });
  } catch (error) {
    console.error("Error dashboard:", error);
    res.status(500).render("error", {
      title: "Error",
      error: { message: "Terjadi kesalahan saat memuat dashboard" },
    });
  }
};

// Master Sekolah - GET
const getMasterSekolah = async (req, res) => {
  try {
    const [schools] = await db.query(
      "SELECT * FROM master_sekolah ORDER BY nama_sekolah ASC"
    );

    res.render("admin/master-sekolah", {
      title: "Master Sekolah",
      currentPage: "master-sekolah",
      schools,
      success: req.query.success || null,
      error: req.query.error || null,
    });
  } catch (error) {
    console.error("Error get master sekolah:", error);
    res.status(500).render("error", {
      title: "Error",
      error: { message: "Terjadi kesalahan saat memuat data sekolah" },
    });
  }
};

// Master Sekolah - CREATE
const createSekolah = async (req, res) => {
  try {
    const { nama_sekolah } = req.body;

    if (!nama_sekolah) {
      return res.redirect(
        "/admin/master-sekolah?error=Nama sekolah harus diisi"
      );
    }

    await db.query("INSERT INTO master_sekolah (nama_sekolah) VALUES (?)", [
      nama_sekolah,
    ]);

    res.redirect(
      "/admin/master-sekolah?success=Data sekolah berhasil ditambahkan"
    );
  } catch (error) {
    console.error("Error create sekolah:", error);
    res.redirect(
      "/admin/master-sekolah?error=Terjadi kesalahan saat menambahkan data"
    );
  }
};

// Master Sekolah - UPDATE
const updateSekolah = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_sekolah } = req.body;

    if (!nama_sekolah) {
      return res.redirect(
        "/admin/master-sekolah?error=Nama sekolah harus diisi"
      );
    }

    await db.query("UPDATE master_sekolah SET nama_sekolah = ? WHERE id = ?", [
      nama_sekolah,
      id,
    ]);

    res.redirect(
      "/admin/master-sekolah?success=Data sekolah berhasil diupdate"
    );
  } catch (error) {
    console.error("Error update sekolah:", error);
    res.redirect(
      "/admin/master-sekolah?error=Terjadi kesalahan saat mengupdate data"
    );
  }
};

// Master Sekolah - DELETE
const deleteSekolah = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah ada tamu yang terdaftar dari sekolah ini
    const [guests] = await db.query(
      "SELECT COUNT(*) as count FROM buku_tamu WHERE sekolah_id = ?",
      [id]
    );

    if (guests[0].count > 0) {
      return res.redirect(
        "/admin/master-sekolah?error=Tidak dapat menghapus. Masih ada tamu terdaftar dari sekolah ini"
      );
    }

    await db.query("DELETE FROM master_sekolah WHERE id = ?", [id]);

    res.redirect("/admin/master-sekolah?success=Data sekolah berhasil dihapus");
  } catch (error) {
    console.error("Error delete sekolah:", error);
    res.redirect(
      "/admin/master-sekolah?error=Terjadi kesalahan saat menghapus data"
    );
  }
};

// Data Tamu - GET
const getDataTamu = async (req, res) => {
  try {
    const selectedSchool = req.query.sekolah || "all";
    const page = parseInt(req.query.page) || 1;
    const limit = 30; // 30 data per halaman
    const offset = (page - 1) * limit;

    // Get all schools for filter
    const [schools] = await db.query(
      "SELECT * FROM master_sekolah ORDER BY nama_sekolah ASC"
    );

    // Build base query for counting total records
    let countQuery = `
            SELECT COUNT(*) as total
            FROM buku_tamu bt
            LEFT JOIN master_sekolah ms ON bt.sekolah_id = ms.id
        `;

    // Build query for getting paginated data
    let query = `
            SELECT bt.*, ms.nama_sekolah, bt.other_instansi 
            FROM buku_tamu bt
            LEFT JOIN master_sekolah ms ON bt.sekolah_id = ms.id
        `;

    let params = [];
    let countParams = [];

    if (selectedSchool !== "all") {
      const whereClause = " WHERE bt.sekolah_id = ?";
      query += whereClause;
      countQuery += whereClause;
      params.push(selectedSchool);
      countParams.push(selectedSchool);
    }

    query += " ORDER BY bt.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Get total count for pagination
    const [countResult] = await db.query(countQuery, countParams);
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Get paginated data
    const [guests] = await db.query(query, params);

    // Get statistics per school
    const [schoolStats] = await db.query(`
            SELECT 
                ms.id,
                ms.nama_sekolah,
                COUNT(bt.id) as total_tamu,
                COUNT(CASE WHEN DATE(bt.created_at) = CURDATE() THEN 1 END) as tamu_hari_ini,
                MAX(bt.created_at) as kunjungan_terakhir
            FROM master_sekolah ms
            LEFT JOIN buku_tamu bt ON ms.id = bt.sekolah_id
            GROUP BY ms.id, ms.nama_sekolah
            ORDER BY total_tamu DESC, ms.nama_sekolah ASC
        `);

    // Check conditions for button states
    const [generateKodeCheck] = await db.query(`
            SELECT COUNT(*) as count_without_kode
            FROM buku_tamu 
            WHERE kode IS NULL OR kode = ''
        `);

    const [migratePhotoCheck] = await db.query(`
            SELECT COUNT(*) as count_base64_photos
            FROM buku_tamu 
            WHERE foto IS NOT NULL 
            AND foto != '' 
            AND foto LIKE 'data:image%'
        `);

    const hasDataWithoutKode = generateKodeCheck[0].count_without_kode > 0;
    const hasBase64Photos = migratePhotoCheck[0].count_base64_photos > 0;

    res.render("admin/data-tamu", {
      title: "Data Tamu",
      // For sidebar active state
      currentPage: "data-tamu",
      // Keep the original name available if other parts rely on it
      currentPageName: "data-tamu",
      guests,
      schools,
      schoolStats,
      selectedSchool,
      success: req.query.success || null,
      error: req.query.error || null,
      session: req.session, // Tambahkan session untuk admin info
      // Pagination data
      currentPageNumber: page,
      totalPages: totalPages,
      totalRecords: totalRecords,
      limit: limit,
      startRecord: offset + 1,
      endRecord: Math.min(offset + limit, totalRecords),
      // Button states
      hasDataWithoutKode: hasDataWithoutKode,
      hasBase64Photos: hasBase64Photos,
    });
  } catch (error) {
    console.error("Error get data tamu:", error);
    res.status(500).render("error", {
      title: "Error",
      error: { message: "Terjadi kesalahan saat memuat data tamu" },
    });
  }
};

// Data Tamu - DELETE
const deleteTamu = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM buku_tamu WHERE id = ?", [id]);

    res.redirect("/admin/data-tamu?success=Data tamu berhasil dihapus");
  } catch (error) {
    console.error("Error delete tamu:", error);
    res.redirect(
      "/admin/data-tamu?error=Terjadi kesalahan saat menghapus data"
    );
  }
};

// Export Excel
const exportExcel = async (req, res) => {
  try {
    // Get filter parameter same as in getDataTamu
    const selectedSchool = req.query.sekolah || "all";

    // Build base query with same filtering logic as getDataTamu
    let query = `
            SELECT 
                bt.id,
                bt.kode,
                ms.nama_sekolah,
                bt.other_instansi,
                bt.nama_lengkap,
                bt.nomor_wa,
                bt.created_at
            FROM buku_tamu bt
            LEFT JOIN master_sekolah ms ON bt.sekolah_id = ms.id
        `;

    let params = [];
    let schoolName = "Semua_Sekolah";

    // Apply filter if specific school selected
    if (selectedSchool !== "all") {
      query += " WHERE bt.sekolah_id = ?";
      params.push(selectedSchool);

      // Get school name for filename
      const [schoolData] = await db.query(
        "SELECT nama_sekolah FROM master_sekolah WHERE id = ?",
        [selectedSchool]
      );
      if (schoolData.length > 0) {
        schoolName = schoolData[0].nama_sekolah.replace(/[^a-zA-Z0-9]/g, "_");
      }
    }

    query += " ORDER BY bt.created_at DESC";

    // Execute query with parameters
    const [guests] = await db.query(query, params);

    // Prepare data for Excel
    const excelData = guests.map((guest, index) => ({
      No: index + 1,
      "Kode Tamu": guest.kode || "-",
      "Asal Sekolah": guest.nama_sekolah || "-",
      "Instansi Lain": guest.other_instansi || "-",
      "Nama Lengkap": guest.nama_lengkap,
      "Nomor WhatsApp": guest.nomor_wa,
      "Tanggal Daftar": new Date(guest.created_at).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excelData);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 }, // No
      { wch: 12 }, // Kode Tamu
      { wch: 30 }, // Asal Sekolah
      { wch: 30 }, // Instansi Lain
      { wch: 25 }, // Nama Lengkap
      { wch: 18 }, // Nomor WhatsApp
      { wch: 22 }, // Tanggal Daftar
    ];

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(wb, ws, "Data Tamu");

    // Generate buffer
    const excelBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    // Create filename with timestamp and school filter
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/T/, "_")
      .replace(/\..+/, "")
      .replace(/:/g, "-");

    // Include school name in filename if filtered
    const filename =
      selectedSchool !== "all"
        ? `Data_Tamu_${schoolName}_${timestamp}.xlsx`
        : `Data_Tamu_${timestamp}.xlsx`;

    // Clear any existing headers and set new ones
    res.removeHeader("Content-Type");
    res.removeHeader("Content-Disposition");
    res.removeHeader("Content-Length");

    // Set response headers for Excel download
    res.status(200);
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": excelBuffer.length,
      "Cache-Control": "no-cache",
    });

    // Send the Excel file
    return res.end(excelBuffer);
  } catch (error) {
    console.error("Error export Excel:", error);
    return res.redirect(
      "/admin/data-tamu?error=Terjadi kesalahan saat export data"
    );
  }
};

// Get tamu yang belum punya kode (untuk modal generate kode)
const getTamuWithoutKode = async (req, res) => {
  try {
    const [tamu] = await db.query(
      `SELECT 
        bt.id,
        bt.nama_lengkap,
        ms.nama_sekolah,
        bt.other_instansi,
        bt.created_at
      FROM buku_tamu bt
      LEFT JOIN master_sekolah ms ON bt.sekolah_id = ms.id
      WHERE bt.kode IS NULL OR bt.kode = ''
      ORDER BY bt.created_at DESC`
    );

    res.json({
      success: true,
      data: tamu,
    });
  } catch (error) {
    console.error("Error get tamu without kode:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data",
    });
  }
};

// Generate kode untuk tamu tertentu atau semua
const generateKode = async (req, res) => {
  try {
    const { tamuIds, autoGenerate } = req.body;

    let query;
    let params = [];

    if (autoGenerate) {
      // Generate untuk semua tamu yang belum punya kode
      query = `SELECT id, nama_lengkap FROM buku_tamu WHERE kode IS NULL OR kode = ''`;
    } else if (tamuIds && tamuIds.length > 0) {
      // Generate untuk tamu yang dipilih
      const placeholders = tamuIds.map(() => "?").join(",");
      query = `SELECT id, nama_lengkap FROM buku_tamu WHERE id IN (${placeholders})`;
      params = tamuIds;
    } else {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data yang dipilih",
      });
    }

    const [tamuList] = await db.query(query, params);

    if (tamuList.length === 0) {
      return res.json({
        success: true,
        message: "Tidak ada tamu yang perlu di-generate kode",
        updated: 0,
      });
    }

    // Generate kode untuk setiap tamu
    let updatedCount = 0;
    for (const tamu of tamuList) {
      // Ambil inisial dari nama
      const words = tamu.nama_lengkap.trim().split(/\s+/);
      const inisial = words
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

      // Format kode: [Inisial][01][ID 2 digit]
      const kode = `${inisial}01${tamu.id.toString().padStart(2, "0")}`;

      // Update kode
      await db.query("UPDATE buku_tamu SET kode = ? WHERE id = ?", [
        kode,
        tamu.id,
      ]);
      updatedCount++;
    }

    res.json({
      success: true,
      message: `Berhasil generate kode untuk ${updatedCount} tamu`,
      updated: updatedCount,
    });
  } catch (error) {
    console.error("Error generate kode:", error);
    res.status(500).json({
      success: false,
      message: "Gagal generate kode",
    });
  }
};

// Migration: Convert Base64 photos to files
const migratePhotos = async (req, res) => {
  try {
    console.log("Starting photo migration...");

    // Get all records with base64 photos (not yet migrated)
    const [guests] = await db.query(
      `SELECT id, foto FROM buku_tamu 
       WHERE foto IS NOT NULL 
       AND foto != '' 
       AND foto NOT LIKE '/uploads/%'
       AND foto NOT LIKE 'uploads/%'`
    );

    if (guests.length === 0) {
      return res.json({
        success: true,
        message: "Tidak ada foto yang perlu dimigrasi",
        migrated: 0,
        failed: 0,
        total: 0,
      });
    }

    console.log(`Found ${guests.length} photos to migrate`);

    let migratedCount = 0;
    let failedCount = 0;
    const failedIds = [];

    // Loop through each guest and convert base64 to file
    for (const guest of guests) {
      try {
        console.log(`Processing guest ID: ${guest.id}`);

        // Convert base64 to file and get path
        const filePath = decodeAndSaveBase64(guest.foto);

        if (filePath) {
          // Update database with new file path
          await db.query("UPDATE buku_tamu SET foto = ? WHERE id = ?", [
            filePath,
            guest.id,
          ]);

          migratedCount++;
          console.log(`✅ Guest ID ${guest.id} migrated successfully`);
        } else {
          failedCount++;
          failedIds.push(guest.id);
          console.error(`❌ Failed to migrate guest ID ${guest.id}`);
        }
      } catch (error) {
        failedCount++;
        failedIds.push(guest.id);
        console.error(`Error migrating guest ID ${guest.id}:`, error.message);
      }
    }

    console.log("Migration completed!");
    console.log(`Migrated: ${migratedCount}, Failed: ${failedCount}`);

    res.json({
      success: true,
      message: `Migrasi selesai! Berhasil: ${migratedCount}, Gagal: ${failedCount}`,
      migrated: migratedCount,
      failed: failedCount,
      failedIds: failedIds,
      total: guests.length,
    });
  } catch (error) {
    console.error("Error in photo migration:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat migrasi foto",
      error: error.message,
    });
  }
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getDashboard,
  getMasterSekolah,
  createSekolah,
  updateSekolah,
  deleteSekolah,
  getDataTamu,
  deleteTamu,
  exportExcel,
  getTamuWithoutKode,
  generateKode,
  migratePhotos,
};

// ============================================
// WhatsApp Management Functions
// ============================================

// GET WhatsApp Settings Page
const getWhatsAppSettings = async (req, res) => {
  try {
    const status = getClientStatus();

    res.render("admin/whatsapp-settings", {
      title: "WhatsApp Settings",
      currentPage: "whatsapp-settings",
      whatsappStatus: status,
    });
  } catch (error) {
    console.error("Error get WhatsApp settings:", error);
    res.status(500).render("error", {
      title: "Error",
      error: { message: "Terjadi kesalahan saat memuat halaman WhatsApp" },
    });
  }
};

// API: Get WhatsApp Status and QR Code
const getWhatsAppStatus = async (req, res) => {
  try {
    const status = getClientStatus();
    const qrCode = getQRCode();

    res.json({
      success: true,
      status: status,
      qrCode: qrCode,
    });
  } catch (error) {
    console.error("Error get WhatsApp status:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil status WhatsApp",
    });
  }
};

// API: Logout WhatsApp Client
const logoutWhatsApp = async (req, res) => {
  try {
    const result = await logoutClient();

    if (result.success) {
      res.json({
        success: true,
        message: "WhatsApp berhasil logout",
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error logout WhatsApp:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat logout WhatsApp",
    });
  }
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getDashboard,
  getMasterSekolah,
  createSekolah,
  updateSekolah,
  deleteSekolah,
  getDataTamu,
  deleteTamu,
  exportExcel,
  getTamuWithoutKode,
  generateKode,
  migratePhotos,
  getWhatsAppSettings,
  getWhatsAppStatus,
  logoutWhatsApp,
};
