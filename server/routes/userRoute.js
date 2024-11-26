const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware'ı ekleyin
const router = express.Router();

// Kullanıcı kaydı için endpoint
router.post("/register", async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    // E-posta adresinin varlığını kontrol et
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Bu e-posta adresi zaten alınmış!" });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = new userModel({
      name,
      surname,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Kayıt işlemi başarısız.", details: error.message });
  }
});

// Kullanıcı girişi için endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı e-posta ile bul
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Böyle bir kullanıcı adı bulunamadı!" });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Lütfen şifrenizi doğru giriniz!" });
    }

    // Giriş başarılı, JWT oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Giriş başarılı",
      token, // Token'ı gönder
      userId: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Giriş işlemi başarısız.", details: error.message });
  }
});

// Kullanıcı çıkışı için endpoint (isteğe bağlı)
router.post("/logout", (req, res) => {
  // Çıkış işlemi için genellikle token'ı istemci tarafından silmek yeterlidir.
  res.status(200).json({ message: "Çıkış başarılı." });
});

module.exports = router;
