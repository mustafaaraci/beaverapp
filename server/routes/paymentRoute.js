const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const paymentModel = require("../models/paymentModel");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Ödeme talebi için endpoint
router.post("/paymentorder", async (req, res) => {
  let { amount, userId } = req.body;

  // Amount'u kuruşa çevir ve tam sayı olduğunu doğrula
  amount = Math.round(amount * 100); // Daha güvenli yuvarlama
  if (!Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({
      error: "Geçersiz amount değeri, tam sayı ve pozitif olmalıdır.",
    });
  }

  try {
    // Stripe ödeme intenti oluştur
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Ödeme talebini veritabanına kaydet
    const newPayment = new paymentModel({
      userId,
      amount,
      currency: "usd",
      status: "pending",
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });

    // Yeni ödeme kaydını veritabanına kaydet
    await newPayment.save();

    // Başarılı yanıt gönder
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      message: "Ödeme talebi başarıyla oluşturuldu.",
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Ödeme talebi oluşturulurken hata:", error.message);
    res
      .status(500)
      .json({ error: "Ödeme talebi oluşturulurken bir hata oluştu." });
  }
});

// Ödeme doğrulama için endpoint
router.post("/confirm", async (req, res) => {
  const { clientSecret, paymentMethodDetails } = req.body;

  try {
    // Ödeme doğrulama işlemi
    const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
      payment_method: paymentMethodDetails,
    });

    // Ödeme başarılıysa
    if (paymentIntent.status === "succeeded") {
      // Veritabanındaki kaydı güncelle
      await paymentModel.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        {
          status: paymentIntent.status,
          paymentMethodId: paymentIntent.payment_method,
        }
      );

      // Başarılı yanıt gönder
      return res.status(200).json({
        message: "Ödeme başarılı.",
        paymentIntentId: paymentIntent.id,
      });
    } else {
      // Ödeme başarısızsa hata mesajı gönder
      return res.status(400).json({
        error: "Ödeme işlemi başarısız.",
      });
    }
  } catch (error) {
    console.error("Ödeme doğrulama sırasında hata:", error.message);
    res
      .status(500)
      .json({ error: "Ödeme doğrulama sırasında bir hata oluştu." });
  }
});

module.exports = router;
