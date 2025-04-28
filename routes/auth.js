const express = require("express");                                         //express: Framework untuk buat server
const router = express.Router();                                            //router: Membuat sub-route (bagian dari server) khusus untuk login
const db = require("../config/database");
const bcrypt = require("bcrypt");                                           //bcrypt: Library untuk membandingkan password yang di-hash.

router.post("/login", (req, res) => {                                       //Saat client next.js mengirim request POST ke /login, route ini dijalankan.
  const { email, password } = req.body; 

  const sql = "SELECT * FROM tbl_login WHERE Email = ?";                    //Cari user di tbl_login yang punya Email sesuai input."
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Terjadi kesalahan di server" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Email Tidak Ditemukan!" });   //Kalau tidak ada data dengan email itu, kasih respon 401 (Unauthorized).
    }

    const user = results[0];                                                 //results[0]: Ambil data user pertama (karena email harus unik).

    // bandingkan password hash
    const match = await bcrypt.compare(password, user.Password);             //bcrypt.compare: Memeriksa apakah password yang diinput sama dengan password di database (yang sudah di-hash)
    if (!match) {
      return res.status(401).json({ message: "Password Anda Salah!" });      //Kalau password salah, kirim error 401.
    }

    return res.status(200).json({ message: "Login Berhasil", user });        //Kalau cocok, kirim status 200 dan data user ke Frontend.
  });
});

module.exports = router;                                                     //Ini supaya file auth.js bisa digunakan di server utama