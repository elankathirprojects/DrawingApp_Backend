const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const env=require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Local database

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "drawingapp"
// });

// Live database

let db;
function handleDisconnect() {
  db = mysql.createConnection({
    host: env.parsed.DB_HOST,
    user: env.parsed.DB_USER,
    password: env.parsed.DB_PASSWORD,
    database: env.parsed.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  db.connect((err) => {
    if (err) {
      console.error('Error when connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Reconnect after 2 seconds
    }
  });

  db.on('error', (err) => {
    console.error('MySQL error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect if connection is lost
    } else {
      throw err;
    }
  });
}

handleDisconnect();

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});



app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  db.query("INSERT INTO drawing_app_users (username, email, password) VALUES (?, ?, ?)", [username, email, password],
    (err, result) => {
      if (err) return res.json({ success: false, message: "Signup failed" });
      res.json({ success: true });
    }
  );
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM drawing_app_users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.length > 0) {
        db.query("UPDATE drawing_app_users SET status = 1 WHERE username = ?", [username], (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ success: false, message: "Failed to update status" });
          }
          io.emit("updateUsers");
          res.json({ success: true });
        });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    }
  );
});

app.post("/logout", (req, res) => {
  const { username } = req.body;

  db.query("UPDATE drawing_app_users SET status = 2 WHERE username = ?", [username], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed!" });
    }
    io.emit("updateUsers");
    res.json({ success: true });
  });
});


app.get("/online-users", (req, res) => {
  db.query("SELECT username FROM drawing_app_users WHERE status = 1", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    const onlineUsers = results.map(user => user.username);
    res.json({ success: true, users: onlineUsers });
  });
});

const drawingHistory = [];

io.on("connection", (socket) => {

  socket.on("request-drawings", () => {
    socket.emit("load-drawings", drawingHistory);
  });

  socket.on("draw", (data) => {
    drawingHistory.push(data);
    socket.broadcast.emit("draw", data);
  });

  socket.on("clear", () => {
    drawingHistory.length = 0; 
    io.emit("clear");
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });
});




server.listen(8081, () => {
  console.log("Server running on port 8081");
});
