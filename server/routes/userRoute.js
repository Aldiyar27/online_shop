const express = require("express");
const pool = require("../db/pool");

const hashPassword = require(
  "../utils/hashPassword"
);
const generateToken = require(
  "../utils/generateToken"
);

const router = express.Router();

const userPublicFields = "id, name, email, phone, address, created_at";

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const hashedPassword =
  await hashPassword(password);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Заполните имя, email и пароль",
      });
    }

    const nameRegex = /^[A-Za-zА-Яа-яЁёҚқӘәІіҢңҒғҮүҰұӨөҺһ]{1,15}$/;

    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message: "Имя должно быть от 1 до 15 символов и содержать только буквы",
      });
    }

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Пользователь с таким email уже существует",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING ${userPublicFields}
      `,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Регистрация прошла успешно",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);

    res.status(500).json({
      message: "Ошибка сервера при регистрации",
      error: error.message,
    });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const token = generateToken(user);

    if (!email || !password) {
      return res.status(400).json({
        message: "Введите email и пароль",
      });
    }

    const result = await pool.query(
      `SELECT ${userPublicFields} FROM users WHERE email = $1 AND password = $2`,
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Неверный email или пароль",
      });
    }
    res.json({
      message: "Вход выполнен успешно",
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error("Ошибка входа:", error);

    res.status(500).json({
      message: "Ошибка сервера при входе",
      error: error.message,
    });
  }
});

// PUT /api/users/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = req.body.phone ? String(req.body.phone).trim() : null;
    const address = req.body.address ? String(req.body.address).trim() : null;

    if (!name || !email) {
      return res.status(400).json({
        message: "Имя и email обязательны",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET name = $1,
          email = $2,
          phone = $3,
          address = $4
      WHERE id = $5
      RETURNING ${userPublicFields}
      `,
      [name, email, phone, address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json({
      message: "Профиль обновлен",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка обновления пользователя:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Пользователь с таким email уже существует",
      });
    }

    res.status(500).json({
      message: "Ошибка сервера при обновлении профиля",
      error: error.message,
    });
  }
});

module.exports = router;
