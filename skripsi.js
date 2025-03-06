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

// tbl_pencatatan
// create data / insert data
app.post('/api/tbl_pencatatan',upload.single('image'),(req, res) => {

    const data = { ...req.body };
    const Id_Pencatatan  = req.body.Id_Pencatatan ;
    const Id_Muzaki = req.body.Id_Muzaki;
    const Nama = req.body.Nama;
    const Jenis_Kelamin = req.body.Jenis_Kelamin;
    const Nama_Ayah = req.body.Nama_Ayah;
    const Jumlah_Beras = req.body.Jumlah_Beras;
    const Tanggal_Catat = req.body.Tanggal_Catat;


    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO tbl_pencatatan (Id_Pencatatan,Id_Muzaki,Nama,Jenis_Kelamin,Nama_Ayah,Jumlah_Beras,Tanggal_Catat) values (?,?,?,?,?,?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ Id_Pencatatan,Id_Muzaki,Nama,Jenis_Kelamin,Nama_Ayah,Jumlah_Beras,Tanggal_Catat], (err, rows, field) => {
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
    const querySql = 'INSERT INTO tbl_pencatatan (Id_Pencatatan,Id_Muzaki,Nama,Jenis_Kelamin,Nama_Ayah,Jumlah_Beras,Tanggal_Catat) values (?,?,?,?,?,?,?);';
 
// jalankan query
koneksi.query(querySql,[Id_Pencatatan,Id_Muzaki,Nama,Jenis_Kelamin,Nama_Ayah,Jumlah_Beras,Tanggal_Catat], (err, rows, field) => {
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
app.get('/api/tbl_pencatatan', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM tbl_pencatatan';

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
app.put('/api/tbl_pencatatan/:Id_Muzaki', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM tbl_pencatatan WHERE Id_Muzaki = ?';
    const Id_Pencatatan  = req.body.Id_Pencatatan ;
    const Id_Muzaki = req.body.Id_Muzaki;
    const Nama = req.body.Nama;
    const Jenis_Kelamin = req.body.Jenis_Kelamin;
    const Nama_Ayah = req.body.Nama_Ayah;
    const Jumlah_Beras = req.body.Jumlah_Beras;
    const Tanggal_Catat = req.body.Tanggal_Catat;


    const queryUpdate = 'UPDATE tbl_pencatatan SET Id_Pencatatan=?,Nama=?,Jenis_Kelamin=?,Nama_Ayah=?,Jumlah_Beras=?,Tanggal_Catat=? WHERE Id_Muzaki = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.Id_Muzaki, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [Id_Pencatatan,Nama,Jenis_Kelamin,Nama_Ayah,Jumlah_Beras,Tanggal_Catat, req.params.Id_Muzaki], (err, rows, field) => {
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
app.delete('/api/tbl_pencatatan/:Id_Muzaki', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM tbl_pencatatan WHERE Id_Muzaki = ?';
    const queryDelete = 'DELETE FROM tbl_pencatatan WHERE Id_Muzaki = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.Id_Muzaki, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.Id_Muzaki, (err, rows, field) => {
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

// tbl_penerimaan
// create data / insert data
app.post('/api/tbl_penerimaan',upload.single('image'),(req, res) => {

    const data = { ...req.body };
    const Id_Penerima   = req.body.Id_Penerima;
    const Id_Mustahik = req.body.Id_Mustahik;
    const Nama = req.body.Nama;
    const Alamat = req.body.Alamat;
    const Jenis_Kelamin = req.body.Jenis_Kelamin;
    const Golongan = req.body.Golongan;
    const Usia = req.body.Usia;
    const Jumlah_Beras = req.body.Jumlah_Beras;
    const Tanggal_Terima = req.body.Tanggal_Terima;

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO tbl_penerimaan (Id_Penerima ,Id_Mustahik,Nama,Alamat,Jenis_Kelamin,Golongan,Usia,Jumlah_Beras,Tanggal_Terima) values (?,?,?,?,?,?,?,?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ Id_Penerima ,Id_Mustahik,Nama,Alamat,Jenis_Kelamin,Golongan,Usia,Jumlah_Beras,Tanggal_Terima], (err, rows, field) => {
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
    const querySql = 'INSERT INTO tbl_penerimaan (Id_Penerima ,Id_Mustahik,Nama,Alamat,Jenis_Kelamin,Golongan,Usia,Jumlah_Beras,Tanggal_Terima) values (?,?,?,?,?,?,?,?,?);';
 
// jalankan query
koneksi.query(querySql,[ Id_Penerima ,Id_Mustahik,Nama,Alamat,Jenis_Kelamin,Golongan,Usia,Jumlah_Beras,Tanggal_Terima], (err, rows, field) => {
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
app.get('/api/tbl_penerimaan', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM tbl_penerimaan';

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
app.put('/api/tbl_penerimaan/:Id_Mustahik', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM tbl_penerimaan WHERE Id_Mustahik = ?';
    const Id_Penerima   = req.body.Id_Penerima;
    const Id_Mustahik = req.body.Id_Mustahik;
    const Nama = req.body.Nama;
    const Alamat = req.body.Alamat;
    const Jenis_Kelamin = req.body.Jenis_Kelamin;
    const Golongan = req.body.Golongan;
    const Usia = req.body.Usia;
    const Jumlah_Beras = req.body.Jumlah_Beras;
    const Tanggal_Terima = req.body.Tanggal_Terima;


    const queryUpdate = 'UPDATE tbl_penerimaan SET Id_Penerima=?,Nama=?, Alamat=?,Jenis_Kelamin=?,Golongan=?,Usia=?,Jumlah_Beras=?,Tanggal_Terima=? WHERE Id_Mustahik = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.Id_Mustahik, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [Id_Penerima ,Nama,Alamat,Jenis_Kelamin,Golongan,Usia,Jumlah_Beras,Tanggal_Terima, req.params.Id_Mustahik], (err, rows, field) => {
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
app.delete('/api/tbl_penerimaan/:Id_Mustahik', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM tbl_penerimaan WHERE Id_Mustahik = ?';
    const queryDelete = 'DELETE FROM tbl_penerimaan WHERE Id_Mustahik = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.Id_Mustahik, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.Id_Mustahik, (err, rows, field) => {
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

// tbl_login
// create data / insert data
app.post('/api/tbl_login',upload.single('image'),(req, res) => {

    const data = { ...req.body };
    const Email   = req.body.Email;
    const Password = req.body.Password;

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO tbl_login (Email ,Password) values (?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ Email ,Password], (err, rows, field) => {
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
    const querySql = 'INSERT INTO tbl_login (Email ,Password) values (?,?);';
 
// jalankan query
koneksi.query(querySql,[ Email ,Password], (err, rows, field) => {
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
app.get('/api/tbl_login', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM tbl_login';

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
app.put('/api/tbl_login/:Email', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM tbl_login WHERE Email = ?';
    const Email = req.body.Email;
    const Password   = req.body.Password;



    const queryUpdate = 'UPDATE tbl_login SET Password=? WHERE Email = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.Email, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [Password, req.params.Email], (err, rows, field) => {
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
app.delete('/api/tbl_login/:Email', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM tbl_login WHERE Email = ?';
    const queryDelete = 'DELETE FROM tbl_login WHERE Email = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.Email, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.Email, (err, rows, field) => {
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
