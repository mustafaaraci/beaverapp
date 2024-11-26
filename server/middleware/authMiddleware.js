// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token'dan ayır

  if (!token) {
    return res.status(401).json({ error: "Token sağlanmadı." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token geçersiz." });
    }
    req.user = user; // Kullanıcı bilgilerini req.user içine ekle
    next(); // Bir sonraki middleware'a geç
  });
};

module.exports = authMiddleware;
