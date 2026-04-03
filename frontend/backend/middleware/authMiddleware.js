import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("HEADER:", authHeader); // 👈 cek ini

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  console.log("TOKEN BACKEND:", token); // 👈 cek ini

  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY");

    console.log("DECODED:", decoded); // 👈 harus muncul

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("ERROR JWT:", err.message); // 👈 INI PENTING
    return res.status(401).json({ message: "Token tidak valid" });
  }
};