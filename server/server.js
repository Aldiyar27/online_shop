const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const paymentRoute = require(
  "./routes/paymentRoute"
);

dotenv.config();

const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const adminUserRoute = require("./routes/adminUserRoute");
const uploadRoute = require("./routes/uploadRoute");

const app = express();
const PORT = Number(process.env.PORT) || 1234;

/*
  MIDDLEWARES
*/

app.use(
  cors({
    origin: "https://online-shop-woad-psi.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

/*
  STATIC FILES
*/

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/*
  ROUTES
*/

app.get("/", (req, res) => {
  res.json({
    message: "Server is working",
    port: PORT
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    message: "API is working",
    port: PORT
  });
});

app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/admin/users", adminUserRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/payment", paymentRoute);

/*
  404
*/

app.use((req, res) => {
  res.status(404).json({
    message: "Маршрут не найден"
  });
});

/*
  ERROR HANDLER
*/

app.use((error, req, res, next) => {
  console.error("Необработанная ошибка сервера:", error);

  res.status(500).json({
    message: "Внутренняя ошибка сервера",
    error: error.message
  });
});

/*
  START SERVER
*/

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
