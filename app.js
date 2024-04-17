const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   port: process.env.MYSQL_PORT,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
// });

MYSQL_HOST=  "roundhouse.proxy.rlwy.net"
MYSQL_PORT= "28787"
MYSQL_USER= "root"
MYSQL_PASSWORD= "rzrWFmayPiTPybVPKnJqZGJTmAmBFRNc"
MYSQL_DATABASE= "railway"

 const connection = mysql.createConnection({
   host: "roundhouse.proxy.rlwy.net" || "localhost",
   port: "28787" ||"3306",
   user: "root" || 'root',
   password: "rzrWFmayPiTPybVPKnJqZGJTmAmBFRNc" || 'n0m3l0',
   database: "railway" || 'playlist_db',
 });


app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Rutas
app.get('/', (req, res) => {
  connection.query('SELECT * FROM songs', (err, results) => {
    if (err) throw err;
    res.render('index', { songs: results });
  });
});

app.get('/lista', (req, res) => {
    connection.query('SELECT * FROM songs', (err, results) => {
      if (err) throw err;
      res.render('lista', { songs: results });
    });
  });

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { nombre, autor, genero, fecha } = req.body;
  connection.query(
    'INSERT INTO songs (nombre, autor, genero, fecha) VALUES (?, ?, ?, ?)',
    [nombre, autor, genero, fecha],
    (err, result) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  const songId = req.params.id;
  connection.query(
    'SELECT * FROM songs WHERE id = ?',
    [songId],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.render('edit', { song: results[0] });
      } else {
        res.redirect('/');
      }
    }
  );
});

app.post('/edit/:id', (req, res) => {
  const songId = req.params.id;
  const { nombre, autor, genero, fecha } = req.body;
  connection.query(
    'UPDATE songs SET nombre = ?, autor = ?, genero = ?, fecha = ? WHERE id = ?',
    [nombre, autor, genero, fecha, songId],
    (err, result) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.get('/delete/:id', (req, res) => {
  const songId = req.params.id;
  connection.query(
    'DELETE FROM songs WHERE id = ?',
    [songId],
    (err, result) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});