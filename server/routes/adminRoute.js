const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const productsResult = await pool.query("SELECT COUNT(*) FROM products");
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    const ordersResult = await pool.query("SELECT COUNT(*) FROM orders");

    res.json({
      productsCount: Number(productsResult.rows[0].count),
      usersCount: Number(usersResult.rows[0].count),
      ordersCount: Number(ordersResult.rows[0].count)
    });
  } catch (error) {
    console.error("Ошибка получения статистики:", error);

    res.status(500).json({
      message: "Ошибка сервера при получении статистики",
      error: error.message
    });
  }
});

module.exports = router;