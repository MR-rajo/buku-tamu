const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal"); // Tidak digunakan - QR Code ditampilkan di web admin

// Inisialisasi WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "buku-tamu-client",
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
});

// Variable untuk track status client
let isClientReady = false;
let currentQRCode = null;
let clientState = "initializing"; // initializing, qr_ready, authenticated, ready, disconnected

// Event: QR Code untuk scanning
client.on("qr", (qr) => {
  currentQRCode = qr;
  clientState = "qr_ready";
});

// Event: Client siap
client.on("ready", () => {
  isClientReady = true;
  currentQRCode = null;
  clientState = "ready";

  console.log("✅ WhatsApp Client siap dan terhubung!");
});

// Event: Client terautentikasi
client.on("authenticated", () => {
  clientState = "authenticated";
  currentQRCode = null;
  console.log("🔐 WhatsApp berhasil diautentikasi.");
});

// Event: Authentication gagal
client.on("auth_failure", (msg) => {
  console.error("❌ WhatsApp Authentication Failure:", msg);
  isClientReady = false;
  currentQRCode = null;
  clientState = "auth_failed";
});

// Event: Client terputus
client.on("disconnected", (reason) => {
  console.log("⚠️ WhatsApp Client Disconnected:", reason);
  isClientReady = false;
  currentQRCode = null;
  clientState = "disconnected";
});

// Event: Loading screen
client.on("loading_screen", (percent, message) => {
  // Hanya tampilkan saat loading 100%
  if (percent === 100) {
    console.log(`⏳ WhatsApp loading complete.`);
  }
});

/**
 * Fungsi untuk mengirim pesan WhatsApp
 * @param {string} number - Nomor WhatsApp tujuan (format: 08xxx atau 628xxx)
 * @param {string} name - Nama lengkap tamu
 * @param {string} code - Kode undian tamu
 * @returns {Promise<Object>} - Result object dengan status dan message
 */
const sendWhatsAppMessage = async (number, name, code) => {
  try {
    // Cek apakah client sudah siap
    if (!isClientReady) {
      console.warn("⚠️ WhatsApp Client belum siap. Pesan tidak dikirim.");
      return {
        success: false,
        message: "WhatsApp Client belum siap",
      };
    }

    // Format nomor telepon Indonesia
    // Ubah 08xxxx menjadi 628xxxx
    let formattedNumber = number.trim().replace(/\D/g, ""); // Hapus karakter non-digit

    if (formattedNumber.startsWith("0")) {
      formattedNumber = "62" + formattedNumber.substring(1);
    } else if (!formattedNumber.startsWith("62")) {
      formattedNumber = "62" + formattedNumber;
    }

    // Format chat ID untuk WhatsApp
    const chatId = `${formattedNumber}@c.us`;

    // Buat pesan yang personal dan informatif
    const message = `*Terima Kasih, ${name}!*

Selamat datang di acara HUT Yayasan KAGUMI KE-50! 🎊

Data kehadiran Anda telah berhasil tercatat.
*Kode Undian Anda:*
*${code}*

Simpan kode ini dengan baik untuk mengikuti *Lucky Wheel Spin* dan berkesempatan memenangkan hadiah menarik!

Selamat menikmati acara!`;

    // Kirim pesan
    await client.sendMessage(chatId, message);

    console.log(`✅ Pesan WhatsApp berhasil dikirim ke: ${formattedNumber}`);

    return {
      success: true,
      message: "Pesan WhatsApp berhasil dikirim",
      number: formattedNumber,
    };
  } catch (error) {
    console.error("❌ Error mengirim WhatsApp:", error.message);

    return {
      success: false,
      message: `Gagal mengirim WhatsApp: ${error.message}`,
      error: error.message,
    };
  }
};

/**
 * Fungsi untuk mendapatkan status client
 * @returns {Object} - Object berisi status lengkap client
 */
const getClientStatus = () => {
  return {
    isReady: isClientReady,
    state: clientState,
    hasQR: currentQRCode !== null,
  };
};

/**
 * Fungsi untuk mendapatkan QR Code
 * @returns {string|null} - QR Code string atau null
 */
const getQRCode = () => {
  return currentQRCode;
};

/**
 * Fungsi untuk logout dan reset client
 * @returns {Promise<Object>} - Result object
 */
const logoutClient = async () => {
  try {
    await client.logout();
    isClientReady = false;
    currentQRCode = null;
    clientState = "disconnected";

    console.log("✅ WhatsApp Client logged out successfully");

    return {
      success: true,
      message: "WhatsApp client logged out successfully",
    };
  } catch (error) {
    console.error("❌ Error logging out WhatsApp client:", error);
    return {
      success: false,
      message: `Error logging out: ${error.message}`,
    };
  }
};

/**
 * Fungsi untuk initialize client
 * Harus dipanggil saat aplikasi start
 */
const initializeClient = () => {
  console.log("🚀 Menginisialisasi WhatsApp Client...");
  client.initialize();
};

module.exports = {
  client,
  sendWhatsAppMessage,
  getClientStatus,
  getQRCode,
  logoutClient,
  initializeClient,
};
