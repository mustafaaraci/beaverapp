const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

require("../server/db");
const port = process.env.PORT || 8081;

const userRoute = require("../server/routes/userRoute");
const paymentRoute = require("../server/routes/paymentRoute");
const ordersRoute = require("../server/routes/ordersRoute");
const addressRoute = require("../server/routes/addressRoute");
const contactRoute = require("../server/routes/contactRoute");

//middlewares
app.use(express.json());
app.use(cors());
//bodyparser gelen verileri ayrıştırmak için kullanıyoruz
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", userRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/addresses", addressRoute);
app.use("/api/contacts", contactRoute);

//serverı ayağa kaldırıyoruz

app.listen(port, () => {
  console.log(
    `BEAVERAPP SERVERI ${port} PORTUNDA BAŞARIYLA AYAĞA KALMAKTADIR. 🔥🔥🔥`
  );
});
