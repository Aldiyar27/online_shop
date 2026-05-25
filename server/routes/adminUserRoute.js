const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// GET /api/admin/users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        email,
        phone,
        address,
        created_at
      FROM users
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка получения пользователей:", error);

    res.status(500).json({
      message: "Ошибка сервера при получении пользователей",
      error: error.message
    });
  }
});

module.exports = router;