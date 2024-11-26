const express = require("express");
const router = express.Router();
const addressModel = require("../models/addressModel");
const authMiddleware = require("../middleware/authMiddleware");

// 1. Adresleri Listeleme
router.get("/getmyaddress", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const addresses = await addressModel.find({ userId });
    res.status(200).json(addresses); // adresleri döndür
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Yeni Adres Ekleme
router.post("/addmyaddress", authMiddleware, async (req, res) => {
  const { name, surname, phone, address, city, addressType } = req.body;
  const userId = req.user.id; // Kullanıcı ID'sini almak

  try {
    const newAddress = new addressModel({
      userId,
      name,
      surname,
      phone,
      address,
      city,
      addressType,
    });
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. Adres Güncelleme
router.put("/updateaddress/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id; // Kullanıcı ID'sini almak
  try {
    const updatedAddress = await addressModel.findOneAndUpdate(
      { _id: req.params.id, userId }, // Kullanıcı ID'sine göre güncelle
      req.body,
      {
        new: true, // Yeni veriyi döndür
        runValidators: true, // Geçerlilik denetimini sürdür
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Adres bulunamadı" });
    }

    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. Adres Silme
router.delete("/deleteaddress/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id; // Kullanıcı ID'sini almak
  try {
    const deletedAddress = await addressModel.findOneAndDelete({
      _id: req.params.id,
      userId, // Kullanıcı ID'sine göre sil
    });

    if (!deletedAddress) {
      return res.status(404).json({ message: "Adres bulunamadı" });
    }

    res.status(200).json({ message: "Adres başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
