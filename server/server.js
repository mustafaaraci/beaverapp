const express = require("express");
const cors = require("cors");
const app = express();
require("../server/db");
const port = process.env.PORT || 8081;

const userRoute = require("../server/routes/userRoute");

//middlewares
app.use(express.json());
app.use(cors());
//bodyparser gelen verileri ayrıştırmak için kullanıyoruz
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);

//serverı ayağa kaldırıyoruz

app.listen(port, () => {
  console.log(
    `PLANE SCAPE SERVERI ${port} PORTUNDA BAŞARIYLA AYAĞA KALMAKTADIR. 🔥🔥🔥`
  );
});
