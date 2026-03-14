import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from server sakupintar!",
  });
});

// cek endpoint di browser
app.get("/api/login", (req, res) => {
  res.send("Login endpoint aktif");
});

app.get("/api/register", (req, res) => {
  res.send("Register endpoint aktif");
});

// REGISTER
app.post("/api/register", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      message: "Username dan password wajib diisi",
    });
  }

  console.log("Register data:", username, password);

  res.json({
    message: "Register berhasil",
    user: username,
  });
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      message: "Username dan password wajib diisi",
    });
  }

  console.log("Login data:", username, password);

  res.json({
    message: "Login berhasil",
    user: username,
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});