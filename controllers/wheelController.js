const db = require("../config/database");

// Get halaman wheel spin (admin)
const getWheelPage = async (req, res) => {
  try {
    res.render("admin/wheel-spin", {
      title: "Lucky Wheel Spin - Undian Berhadiah",
      layout: "layout",
      currentPage: "wheel-spin",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("error", {
      title: "Error",
      error: { message: "Terjadi kesalahan saat memuat halaman" },
    });
  }
};

// API: Get data untuk wheel spin
const getWheelData = async (req, res) => {
  try {
    // Ambil semua data tamu yang memiliki kode DAN belum pernah menang
    // Exclude tamu yang sudah ada di table wheel_spin
    // Exclude tamu dari sekolah dengan keyword "Undangan"
    const [tamu] = await db.query(
      `SELECT 
        bt.id,
        bt.kode, 
        bt.nama_lengkap, 
        bt.foto,
        ms.nama_sekolah,
        bt.other_instansi
      FROM buku_tamu bt
      LEFT JOIN master_sekolah ms ON bt.sekolah_id = ms.id
      WHERE bt.kode IS NOT NULL
        AND bt.id NOT IN (
          SELECT tamu_id FROM wheel_spin
        )
        AND (ms.nama_sekolah NOT LIKE '%Undangan%' OR ms.nama_sekolah IS NULL)
      ORDER BY bt.created_at DESC`
    );

    res.json({
      success: true,
      data: tamu,
      total: tamu.length,
    });
  } catch (error) {
    console.error("Error get wheel data:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data",
    });
  }
};

// API: Putar wheel dan pilih pemenang acak
const spinWheel = async (req, res) => {
  try {
    // Ambil semua data tamu yang memiliki kode DAN belum pernah menang
    // Exclude tamu dari sekolah dengan keyword "Undangan"
    const [tamu] = await db.query(
      `SELECT 
        bt.id,
        bt.kode, 
        bt.nama_lengkap, 
        bt.foto,
        ms.nama_sekolah,
        bt.other_instansi
      FROM buku_tamu bt
      LEFT JOIN master_sekolah ms ON bt.sekolah_id = ms.id
      WHERE bt.kode IS NOT NULL
        AND bt.id NOT IN (
          SELECT tamu_id FROM wheel_spin
        )
        AND (ms.nama_sekolah NOT LIKE '%Undangan%' OR ms.nama_sekolah IS NULL)
      ORDER BY bt.created_at DESC`
    );

    if (tamu.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada peserta undian",
      });
    }

    // Pilih pemenang secara acak
    const randomIndex = Math.floor(Math.random() * tamu.length);
    const winner = tamu[randomIndex];

    // INSERT data pemenang ke table wheel_spin
    await db.query(
      `INSERT INTO wheel_spin (tamu_id, created_at) VALUES (?, NOW())`,
      [winner.id]
    );

    // Hitung index untuk animasi (posisi pada wheel)
    const winnerPosition = randomIndex;

    res.json({
      success: true,
      winner: {
        id: winner.id,
        kode: winner.kode,
        nama_lengkap: winner.nama_lengkap,
        foto: winner.foto,
        nama_sekolah: winner.nama_sekolah,
        other_instansi: winner.other_instansi,
        position: winnerPosition,
      },
      totalParticipants: tamu.length,
    });
  } catch (error) {
    console.error("Error spin wheel:", error);
    res.status(500).json({
      success: false,
      message: "Gagal melakukan undian",
    });
  }
};

// API: Get history pemenang dari table wheel_spin
const getWinnerHistory = async (req, res) => {
  try {
    const [winners] = await db.query(
      `SELECT 
        ws.id,
        ws.tamu_id,
        ws.created_at,
        bt.kode,
        bt.nama_lengkap,
        bt.foto,
        ms.nama_sekolah,
        bt.other_instansi
      FROM wheel_spin ws
      INNER JOIN buku_tamu bt ON ws.tamu_id = bt.id
      LEFT JOIN master_sekolah ms ON bt.sekolah_id = ms.id
      ORDER BY ws.id ASC`
    );

    res.json({
      success: true,
      data: winners,
      total: winners.length,
    });
  } catch (error) {
    console.error("Error get winner history:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data pemenang",
    });
  }
};

module.exports = {
  getWheelPage,
  getWheelData,
  spinWheel,
  getWinnerHistory,
};
