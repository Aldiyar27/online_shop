const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

/*
  POST /api/upload
*/

router.post(
  "/",
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Файл не загружен"
        });
      }

      res.status(201).json({
        message: "Файл успешно загружен",

        file: {
          filename: req.file.filename,

          path: `/uploads/${req.file.filename}`,

          url: `http://localhost:1234/uploads/${req.file.filename}`
        }
      });
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);

      res.status(500).json({
        message: "Ошибка сервера при загрузке файла",
        error: error.message
      });
    }
  }
);

module.exports = router;