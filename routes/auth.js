const express = require("express");
const router = express.Router();
const db = require("../config/database");
const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM tbl_login WHERE Email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Terjadi kesalahan di server" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const user = results[0];

    // bandingkan password hash
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    return res.status(200).json({ message: "Login berhasil", user });
  });
});

module.exports = router;
