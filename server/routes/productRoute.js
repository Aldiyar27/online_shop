const express = require("express");
const pool = require("../db/pool");
const upload = require("../middleware/upload");

const router = express.Router();

const productSelect = `
  SELECT
    id,
    title,
    price,
    category,
    brand,
    material,
    color,
    size,
    in_stock AS "inStock",
    image,
    description
  FROM products
`;


router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    try {
      res.json({
        message: "Файл загружен",
        file: req.file
      });
    } catch (error) {
      res.status(500).json({
        message: "Ошибка загрузки файла",
        error: error.message
      });
    }
  }
);

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`${productSelect} ORDER BY id ASC`);
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка получения товаров:", error);

    res.status(500).json({
      message: "Ошибка сервера при получении товаров",
      error: error.message,
    });
  }
});


// POST /api/products
router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const price = Number(req.body.price);
    const category = String(req.body.category || "").trim();
    const brand = req.body.brand ? String(req.body.brand).trim() : null;
    const material = req.body.material ? String(req.body.material).trim() : null;
    const color = req.body.color ? String(req.body.color).trim() : null;
    const image = req.body.image ? String(req.body.image).trim() : null;
    const description = req.body.description ? String(req.body.description).trim() : null;
    const inStock = req.body.inStock === undefined ? true : Boolean(req.body.inStock);
    const size = Array.isArray(req.body.size)
      ? req.body.size.map((item) => String(item).trim()).filter(Boolean)
      : String(req.body.size || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    if (!title || !category || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        message: "Заполните название, категорию и корректную цену",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO products (
        title, price, category, brand, material, color, size, in_stock, image, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        title,
        price,
        category,
        brand,
        material,
        color,
        size,
        in_stock AS "inStock",
        image,
        description
      `,
      [title, price, category, brand, material, color, size, inStock, image, description]
    );

    res.status(201).json({
      message: "Товар успешно добавлен",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка добавления товара:", error);

    res.status(500).json({
      message: "Ошибка сервера при добавлении товара",
      error: error.message,
    });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`${productSelect} WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Товар не найден",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка получения товара:", error);

    res.status(500).json({
      message: "Ошибка сервера при получении товара",
      error: error.message,
    });
  }
});


// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      price,
      size,
      inStock
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        message: "Название и цена обязательны"
      });
    }

    const result = await pool.query(
      `
      UPDATE products
      SET 
        title = $1,
        price = $2,
        size = $3,
        in_stock = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        title,
        price,
        size,
        inStock,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Товар не найден"
      });
    }

    res.json({
      message: "Товар успешно обновлен",
      product: result.rows[0]
    });
  } catch (error) {
    console.error("Ошибка редактирования товара:", error);

    res.status(500).json({
      message: "Ошибка сервера при редактировании товара",
      error: error.message
    });
  }
});


module.exports = router;
