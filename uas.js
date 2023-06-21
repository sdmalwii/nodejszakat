const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

const multer = require('multer')
const path = require('path')

var cors = require('cors');

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: '*'
}));

// script upload

app.use(express.static("./public"))
 //! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
}); 

// create data / insert data
app.post('/api/parfum',upload.single('image'),(req, res) => {

    const data = { ...req.body };
    const kode_barang = req.body.kode_barang;
    const nama_pembeli = req.body.nama_pembeli;
    const tanggal_beli = req.body.tanggal_beli;
    const nama_parfum = req.body.nama_parfum;
    const ml = req.body.ml;
    const harga = req.body.harga;


    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO parfum (kode_barang,nama_pembeli,tanggal_beli,nama_parfum,ml,harga) values (?,?,?,?,?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ kode_barang,nama_pembeli,tanggal_beli,nama_parfum,ml,harga], (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
       
            // jika request berhasil
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:5000/images/' + req.file.filename;
        const foto =   imgsrc;
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySql = 'INSERT INTO parfum (kode_barang,nama_pembeli,tanggal_beli,nama_parfum,foto,ml,harga) values (?,?,?,?,?,?,?);';
 
// jalankan query
koneksi.query(querySql,[ kode_barang,nama_pembeli,tanggal_beli,nama_parfum,foto,ml,harga], (err, rows, field) => {
    // error handling
    if (err) {
        return res.status(500).json({ message: 'Gagal insert data!', error: err });
    }

    // jika request berhasil
    res.status(201).json({ success: true, message: 'Berhasil insert data!' });
});
}
});

// read data / get data
app.get('/api/parfum', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM parfum';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});

// update data
app.put('/api/parfum/:kode_barang', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM parfum WHERE kode_barang = ?';
    const kode_barang = req.body.kode_barang;
    const nama_pembeli = req.body.nama_pembeli;
    const tanggal_beli = req.body.tanggal_beli;
    const nama_parfum = req.body.nama_parfum;
    const ml = req.body.ml;
    const harga = req.body.harga;


    const queryUpdate = 'UPDATE parfum SET nama_pembeli=?,tanggal_beli=?,nama_parfum=?,ml=?,harga=? WHERE kode_barang = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.kode_barang, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [nama_pembeli,tanggal_beli,nama_parfum,ml,harga, req.params.kode_barang], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// delete data
app.delete('/api/parfum/:kode_barang', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM parfum WHERE kode_barang = ?';
    const queryDelete = 'DELETE FROM parfum WHERE kode_barang = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.kode_barang, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.kode_barang, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});


// -------------------------------------------------------------------------------------------------------------
// create data / insert data
app.post('/api/pemesanan',upload.single('image'),(req, res) => {

    const data = { ...req.body };
    const no_pemesanan = req.body.no_pemesanan;
    const nama_pembeli = req.body.nama_pembeli;
    const alamat = req.body.alamat;

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO pemesanan (no_pemesanan,nama_pembeli,alamat) values (?,?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ no_pemesanan,nama_pembeli,alamat], (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
       
            // jika request berhasil
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:5000/images/' + req.file.filename;
        const foto =   imgsrc;
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySql = 'INSERT INTO pemesanan (no_pemesanan,nama_pembeli,alamat) values (?,?,?);';
 
// jalankan query
koneksi.query(querySql,[ no_pemesanan,nama_pembeli,alamat], (err, rows, field) => {
    // error handling
    if (err) {
        return res.status(500).json({ message: 'Gagal insert data!', error: err });
    }

    // jika request berhasil
    res.status(201).json({ success: true, message: 'Berhasil insert data!' });
});
}
});

// read data / get data
app.get('/api/pemesanan', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM pemesanan';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});

// update data
app.put('/api/pemesanan/:no_pemesanan', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM pemesanan WHERE no_pemesanan = ?';
    const no_pemesanan = req.body.no_pemesanan;
    const nama_pembeli = req.body.nama_pembeli;
    const alamat = req.body.alamat;

    const queryUpdate = 'UPDATE pemesanan SET nama_pembeli=?,alamat=? WHERE no_pemesanan = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.no_pemesanan, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [nama_pembeli,alamat, req.params.no_pemesanan], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// delete data
app.delete('/api/pemesanan/:no_pemesanan', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM pemesanan WHERE no_pemesanan = ?';
    const queryDelete = 'DELETE FROM pemesanan WHERE no_pemesanan = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.no_pemesanan, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.no_pemesanan, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});



// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
