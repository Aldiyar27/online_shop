import { useState } from "react";
import { Link } from "react-router-dom";

import {
  createProduct,
  uploadImage
} from "../services/api";

import "../styles/AdminCreateProductPage.css";

function AdminCreateProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    brand: "",
    material: "",
    color: "",
    size: "",
    description: "",
    inStock: true
  });

  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } =
      event.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value
    });
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    setImageFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);

      setMessage("");
      setError("");

      let imagePath = "";

      /*
        UPLOAD IMAGE
      */

      if (imageFile) {
        const uploadedImage =
          await uploadImage(imageFile);

        imagePath = uploadedImage.image;
      }

      /*
        CREATE PRODUCT
      */

      const productData = {
        title: formData.title,
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand,
        material: formData.material,
        color: formData.color,

        size: formData.size
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),

        description: formData.description,

        inStock: formData.inStock,

        image: imagePath
      };

      await createProduct(productData);

      setMessage(
        "Товар успешно добавлен"
      );

      setFormData({
        title: "",
        price: "",
        category: "",
        brand: "",
        material: "",
        color: "",
        size: "",
        description: "",
        inStock: true
      });

      setImageFile(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-create">
      <div className="admin-create__card">
        <Link
          to="/admin/products"
          className="admin-create__back"
        >
          ← Назад
        </Link>

        <span className="admin-create__label">
          Новый товар
        </span>

        <h1 className="admin-create__title">
          Добавить товар
        </h1>

        <p className="admin-create__description">
          Загрузка изображения через multer.
        </p>

        {message && (
          <p className="admin-success">
            {message}
          </p>
        )}

        {error && (
          <p className="admin-error">
            {error}
          </p>
        )}

        <form
          className="admin-create__form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="title"
            placeholder="Название товара"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Цена"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Категория"
            value={formData.category}
            onChange={handleChange}
          />

          <input
            type="text"
            name="brand"
            placeholder="Бренд"
            value={formData.brand}
            onChange={handleChange}
          />

          <input
            type="text"
            name="material"
            placeholder="Материал"
            value={formData.material}
            onChange={handleChange}
          />

          <input
            type="text"
            name="color"
            placeholder="Цвет"
            value={formData.color}
            onChange={handleChange}
          />

          <input
            type="text"
            name="size"
            placeholder="Размеры: S, M, L"
            value={formData.size}
            onChange={handleChange}
          />

          {/* FILE INPUT */}

          <div className="admin-upload">
            <label>
              Изображение товара
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {imageFile && (
              <div className="admin-preview">
                <img
                  src={URL.createObjectURL(
                    imageFile
                  )}
                  alt="preview"
                />

                <p>{imageFile.name}</p>
              </div>
            )}
          </div>

          <textarea
            name="description"
            placeholder="Описание"
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />

            В наличии
          </label>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Загрузка..."
              : "Добавить товар"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminCreateProductPage;