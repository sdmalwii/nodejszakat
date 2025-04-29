const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const koneksi = require('./config/database');
const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));
app.use(express.static("./public"));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public/images/'),
  filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// API Routes

// ---------- TBL_PENCATATAN ---------- //
app.post('/api/tbl_pencatatan', (req, res) => {
  const data = req.body;
  data.Tanggal_Catat = new Date(data.Tanggal_Catat).toISOString().slice(0, 19).replace('T', ' ');

  koneksi.query('INSERT INTO tbl_pencatatan SET ?', data, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(201).json({ success: true, message: 'Data berhasil ditambahkan', insertedId: result.insertId });
  });
});

app.get('/api/tbl_pencatatan', (req, res) => {
  koneksi.query('SELECT * FROM tbl_pencatatan', (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, data: rows });
  });
});

app.put('/api/tbl_pencatatan/:Id_Pencatatan', (req, res) => {
  const { Id_Pencatatan } = req.params;
  const data = { ...req.body };
  data.Tanggal_Catat = new Date(data.Tanggal_Catat).toISOString().slice(0, 19).replace('T', ' ');

  koneksi.query('SELECT * FROM tbl_pencatatan WHERE Id_Pencatatan = ?', [Id_Pencatatan], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!rows.length) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });

    koneksi.query('UPDATE tbl_pencatatan SET ? WHERE Id_Pencatatan = ?', [data, Id_Pencatatan], err2 => {
      if (err2) return res.status(500).json({ success: false, message: err2.message });
      res.status(200).json({ success: true, message: 'Data berhasil diupdate' });
    });
  });
});

app.delete('/api/tbl_pencatatan/:Id_Pencatatan', (req, res) => {
  const { Id_Pencatatan } = req.params;

  koneksi.query('SELECT * FROM tbl_pencatatan WHERE Id_Pencatatan = ?', [Id_Pencatatan], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!rows.length) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });

    koneksi.query('DELETE FROM tbl_pencatatan WHERE Id_Pencatatan = ?', [Id_Pencatatan], err2 => {
      if (err2) return res.status(500).json({ success: false, message: err2.message });
      res.status(200).json({ success: true, message: 'Data berhasil dihapus' });
    });
  });
});

// ---------- TBL_PENERIMAAN ---------- //
app.post('/api/tbl_penerimaan', upload.single('image'), (req, res) => {
  const { Id_Penerima, Id_Mustahik, Nama, Alamat, Jenis_Kelamin, Golongan, Usia, Jumlah_Beras, Tanggal_Terima } = req.body;
  const foto = req.file ? `http://localhost:5000/images/${req.file.filename}` : null;
  const query = 'INSERT INTO tbl_penerimaan (Id_Penerima, Id_Mustahik, Nama, Alamat, Jenis_Kelamin, Golongan, Usia, Jumlah_Beras, Tanggal_Terima) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  koneksi.query(query, [Id_Penerima, Id_Mustahik, Nama, Alamat, Jenis_Kelamin, Golongan, Usia, Jumlah_Beras, Tanggal_Terima], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal insert data!', error: err });
    res.status(201).json({ success: true, message: 'Berhasil insert data!' });
  });
});

app.get('/api/tbl_penerimaan', (req, res) => {
  koneksi.query('SELECT * FROM tbl_penerimaan', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
    res.status(200).json({ success: true, data: rows });
  });
});

app.put('/api/tbl_penerimaan/:Id_Mustahik', (req, res) => {
  const { Id_Penerima, Nama, Alamat, Jenis_Kelamin, Golongan, Usia, Jumlah_Beras, Tanggal_Terima } = req.body;
  const querySearch = 'SELECT * FROM tbl_penerimaan WHERE Id_Mustahik = ?';
  const queryUpdate = 'UPDATE tbl_penerimaan SET Id_Penerima=?, Nama=?, Alamat=?, Jenis_Kelamin=?, Golongan=?, Usia=?, Jumlah_Beras=?, Tanggal_Terima=? WHERE Id_Mustahik=?';

  koneksi.query(querySearch, [req.params.Id_Mustahik], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
    if (!rows.length) return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });

    koneksi.query(queryUpdate, [Id_Penerima, Nama, Alamat, Jenis_Kelamin, Golongan, Usia, Jumlah_Beras, Tanggal_Terima, req.params.Id_Mustahik], (err) => {
      if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
      res.status(200).json({ success: true, message: 'Berhasil update data!' });
    });
  });
});

app.delete('/api/tbl_penerimaan/:Id_Mustahik', (req, res) => {
  const querySearch = 'SELECT * FROM tbl_penerimaan WHERE Id_Mustahik = ?';
  const queryDelete = 'DELETE FROM tbl_penerimaan WHERE Id_Mustahik = ?';

  koneksi.query(querySearch, [req.params.Id_Mustahik], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
    if (!rows.length) return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });

    koneksi.query(queryDelete, [req.params.Id_Mustahik], (err) => {
      if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
      res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
    });
  });
});

// ---------- TBL_LOGIN ---------- //
app.post('/api/tbl_login', upload.single('image'), (req, res) => {
  const { Email, Password } = req.body;
  const query = 'INSERT INTO tbl_login (Email, Password) VALUES (?, ?)';

  koneksi.query(query, [Email, Password], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal insert data!', error: err });
    res.status(201).json({ success: true, message: 'Berhasil insert data!' });
  });
});

app.get('/api/tbl_login', (req, res) => {
  koneksi.query('SELECT * FROM tbl_login', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
    res.status(200).json({ success: true, data: rows });
  });
});

app.put('/api/tbl_login/:Email', (req, res) => {
  const { Password } = req.body;
  const querySearch = 'SELECT * FROM tbl_login WHERE Email = ?';
  const queryUpdate = 'UPDATE tbl_login SET Password = ? WHERE Email = ?';

  koneksi.query(querySearch, [req.params.Email], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
    if (!rows.length) return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });

    koneksi.query(queryUpdate, [Password, req.params.Email], (err) => {
      if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
      res.status(200).json({ success: true, message: 'Berhasil update data!' });
    });
  });
});

app.delete('/api/tbl_login/:Email', (req, res) => {
  const querySearch = 'SELECT * FROM tbl_login WHERE Email = ?';
  const queryDelete = 'DELETE FROM tbl_login WHERE Email = ?';

  koneksi.query(querySearch, [req.params.Email], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
    if (!rows.length) return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });

    koneksi.query(queryDelete, [req.params.Email], (err) => {
      if (err) return res.status(500).json({ message: 'Ada kesalahan', error: err });
      res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
    });
  });
});

// Auth routes
app.use("/api", authRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));