const express = require("express");
const app = express();
const port = 3000;
const { Client } = require("pg");

MYSQL_HOST = "ep-long-cherry-a4kv9ehp-pooler.us-east-1.aws.neon.tech";
MYSQL_PORT = "5432";
MYSQL_USER = "default";
MYSQL_PASSWORD = "joyDMz0u7PhR";
MYSQL_DATABASE = "verceldb";

const connection = new Client({
  host: MYSQL_HOST || "localhost",
  port: MYSQL_PORT || "3306",
  user: MYSQL_USER || "root",
  password: MYSQL_PASSWORD || "n0m3l0",
  database: MYSQL_DATABASE || "playlist_db",
  ssl: {
    rejectUnauthorized: false,
  },
  sslmode: "require",
});


connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Rutas
app.get("/", (req, res) => {
  connection.query("SELECT * FROM songs", (err, results) => {
    if (err) throw err;
    res.render("index", { songs: results.rows }); // En PostgreSQL, los resultados se encuentran en results.rows
  });
});

app.get("/lista", (req, res) => {
  connection.query("SELECT * FROM songs", (err, results) => {
    if (err) throw err;
    res.render("lista", { songs: results.rows }); // En PostgreSQL, los resultados se encuentran en results.rows
  });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  const { nombre, autor, genero, fecha } = req.body;
  const id = Math.floor(Math.random() * 90000000) + 10000000;
  connection.query(
    "INSERT INTO songs (id,nombre, autor, genero, fecha) VALUES ($1, $2, $3, $4, $5)",
    [id,nombre, autor, genero, fecha],
    (err, result) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.get("/edit/:id", (req, res) => {
  const songId = req.params.id;
  connection.query(
    "SELECT * FROM songs WHERE id = $1",
    [songId],
    (err, results) => {
      if (err) throw err;
      if (results.rows.length > 0) {
        res.render("edit", { song: results.rows[0] });
      } else {
        res.redirect("/");
      }
    }
  );
});

app.post("/edit/:id", (req, res) => {
  const songId = req.params.id;
  const { nombre, autor, genero, fecha } = req.body;
  connection.query(
    "UPDATE songs SET nombre = $1, autor = $2, genero = $3, fecha = $4 WHERE id = $5",
    [nombre, autor, genero, fecha, songId],
    (err, result) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.get("/delete/:id", (req, res) => {
  const songId = req.params.id;
  connection.query(
    "DELETE FROM songs WHERE id = $1",
    [songId],
    (err, result) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
