const sendOrderEmail = require("../utils/sendOrderEmail");
const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const values = [];
    let whereSql = "";

    if (userId) {
      values.push(userId);
      whereSql = "WHERE o.user_id = $1";
    }

    const result = await pool.query(
      `
      SELECT
        o.id,
        o.user_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.customer_address,
        o.comment,
        o.total_price,
        o.status,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'orderId', oi.order_id,
              'productId', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'title', p.title,
              'image', p.image,
              'category', p.category,
              'brand', p.brand
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_item oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      ${whereSql}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      values
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка получения заказов:", error);

    res.status(500).json({
      message: "Ошибка сервера при получении заказов",
      error: error.message,
    });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Заказ не найден",
      });
    }

    const itemsResult = await pool.query(
      `
      SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.title,
        p.image,
        p.category,
        p.brand
      FROM order_item oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id ASC
      `,
      [id]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Ошибка получения заказа:", error);

    res.status(500).json({
      message: "Ошибка сервера при получении заказа",
      error: error.message,
    });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const { userId, customerName, email, phone, address, comment, items } = req.body;

    if (!customerName || !email || !phone || !address) {
      return res.status(400).json({
        message: "Заполните имя, email, телефон и адрес",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Корзина пустая",
      });
    }

    const totalPrice = items.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    await client.query("BEGIN");

    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        comment,
        total_price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [userId || null, customerName, email, phone, address, comment || "", totalPrice]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `
        INSERT INTO order_item (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES ($1, $2, $3, $4)
        `,
        [order.id, item.id, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    
    try {
      await sendOrderEmail({
        to: customerEmail || email,
        order: {
          id: createdOrder.id,
          customerName,
          phone,
          address,
          items
        }
      });
    } catch (emailError) {
      console.error("Ошибка отправки email:", emailError.message);
    }

res.status(201).json({
      message: "Заказ успешно создан",
      order,
      items,
      totalPrice,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Ошибка создания заказа:", error);

    res.status(500).json({
      message: "Ошибка сервера при создании заказа",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// PUT /api/orders/:id/status
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Неверный статус заказа"
      });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Заказ не найден"
      });
    }

    res.json({
      message: "Статус заказа обновлен",
      order: result.rows[0]
    });
  } catch (error) {
    console.error("Ошибка обновления статуса:", error);

    res.status(500).json({
      message: "Ошибка сервера при обновлении статуса",
      error: error.message
    });
  }
});

module.exports = router;
