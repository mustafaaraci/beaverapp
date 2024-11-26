const express = require("express");
const router = express.Router();
const orderModel = require("../models/orderModel");
const authMiddleware = require("../middleware/authMiddleware");

// Sipariş kaydetme endpoint'i
router.post("/myorders", async (req, res) => {
  const { userId, items, total, address, createdAt } = req.body;

  try {
    const newOrder = new orderModel({
      userId,
      items,
      total,
      address,
      createdAt,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Sipariş kaydedilirken hata:", error);
    res.status(500).send({ error: "Sipariş kaydedilirken bir hata oluştu." });
  }
});

// Siparişleri getiren endpoint
router.get("/getmyorders", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await orderModel.find({ userId }); // Kullanıcı ID'sine göre siparişleri bul
    res.status(200).json(orders);
  } catch (error) {
    console.error("Siparişler alınırken hata:", error);
    res.status(500).send({ error: "Siparişler alınırken bir hata oluştu." });
  }
});

module.exports = router;
