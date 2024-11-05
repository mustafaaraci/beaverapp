require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL, {})
  .then(() => {
    console.log("VERİ TABANI BAĞLANTISI BAŞARILIDIR. 🔥🔥🔥");
  })
  .catch((err) => {
    console.log("VERİ TABANI BAĞLANTISI HATALI ⚠️⚠️⚠️", err);
  });
