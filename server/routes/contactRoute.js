const express = require("express");
const router = express.Router();
const contactModel = require("../models/contactModel");
const authMiddleware = require("../middleware/authMiddleware");

// İletişim bilgileri listeleme
router.get("/getmycontact", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const contacts = await contactModel.find({ userId });
    res.status(200).json(contacts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "İletişim bilgileri alınırken bir hata oluştu." });
  }
});

// İletişim bilgisini ekle
router.post("/addmycontact", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { phone, email, address } = req.body;
  try {
    const existingContact = await contactModel.findOne({ email, userId });
    if (existingContact) {
      return res.status(400).json({
        message: "Bu e-posta adresi ile zaten bir iletişim kaydı var.",
      });
    }

    const newContact = new contactModel({ userId, phone, email, address });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// İletişim bilgisini güncelle
router.put("/updatemycontact/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { phone, email, address } = req.body;
  const contactId = req.params.id;

  try {
    const contact = await contactModel.findOneAndUpdate(
      { _id: contactId, userId },
      { phone, email, address },
      { new: true, runValidators: true }
    );

    if (!contact)
      return res.status(404).json({ message: "İletişim bulunamadı." });

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// İletişim bilgisini sil
router.delete("/deletemycontact/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const contactId = req.params.id;

  try {
    const contact = await contactModel.findOneAndDelete({
      _id: contactId,
      userId,
    });
    if (!contact)
      return res.status(404).json({ message: "İletişim bulunamadı." });

    res.status(200).json({ message: "İletişim başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
