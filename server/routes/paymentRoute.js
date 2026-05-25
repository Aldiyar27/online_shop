const express = require("express");

const sendOrderEmail = require(
  "../utils/sendOrderEmail"
);

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      customerName,
      phone,
      address,
      items
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email обязателен"
      });
    }

    await sendOrderEmail({
      to: email,

      order: {
        id: Date.now(),

        customerName,

        phone,

        address,

        items
      }
    });

    res.json({
      message:
        "Оплата успешна. Email отправлен"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка оплаты",
      error: error.message
    });
  }
});

module.exports = router;