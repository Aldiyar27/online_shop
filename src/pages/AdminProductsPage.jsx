import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, updateProduct } from "../services/api";
import "../styles/AdminTablePages.css";

function AdminProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    price: "",
    size: "",
    inStock: true
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleLogout() {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  }

  function loadProducts() {
    setLoading(true);

    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function startEdit(product) {
    setEditingProductId(product.id);

    setEditData({
      title: product.title || "",
      price: product.price || "",
      size: Array.isArray(product.size) ? product.size.join(", ") : "",
      inStock: product.in_stock
    });

    setMessage("");
    setError("");
  }

  function cancelEdit() {
    setEditingProductId(null);

    setEditData({
      title: "",
      price: "",
      size: "",
      inStock: true
    });
  }

  function handleEditChange(event) {
    const { name, value, type, checked } = event.target;

    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value
    });
  }

  async function saveProduct(productId) {
    try {
      setMessage("");
      setError("");

      if (!editData.title.trim()) {
        setError("Название товара не может быть пустым");
        return;
      }

      if (!editData.price || Number(editData.price) <= 0) {
        setError("Цена должна быть больше 0");
        return;
      }

      const updatedProductData = {
        title: editData.title,
        price: Number(editData.price),
        size: editData.size
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        inStock: editData.inStock
      };

      const result = await updateProduct(productId, updatedProductData);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? result.product : product
        )
      );

      setMessage("Товар успешно обновлен");
      setEditingProductId(null);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">AdminPanel</div>

        <nav className="admin-sidebar__nav">
          <Link to="/admin" className="admin-sidebar__link">
            Главная
          </Link>

          <Link to="/admin/products" className="admin-sidebar__link active">
            Товары
          </Link>

          <Link to="/admin/orders" className="admin-sidebar__link">
            Заказы
          </Link>

          <Link to="/admin/users" className="admin-sidebar__link">
            Пользователи
          </Link>

          <Link to="/" className="admin-sidebar__link">
            На сайт
          </Link>
        </nav>

        <button className="admin-sidebar__logout" onClick={handleLogout}>
          Выйти
        </button>
      </aside>

      <section className="admin-content">
        <div className="admin-content__top">
          <div>
            <span className="admin-content__label">Товары</span>

            <h1 className="admin-content__title">
              Управление товарами
            </h1>

            <p className="admin-content__description">
              Здесь можно редактировать название, цену, размеры и наличие товара.
            </p>
          </div>

          <Link to="/admin/products/create" className="admin-content__button">
            + Добавить товар
          </Link>
        </div>

        {loading && (
          <p className="admin-message">
            Загрузка товаров...
          </p>
        )}

        {error && (
          <p className="admin-message admin-message--error">
            {error}
          </p>
        )}

        {message && (
          <p className="admin-message admin-message--success">
            {message}
          </p>
        )}

        {!loading && (
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Фото</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Размеры</th>
                  <th>Наличие</th>
                  <th>Действия</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    <td>
                      <img
                        className="admin-table__image"
                        src={product.image}
                        alt={product.title}
                      />
                    </td>

                    <td>
                      {editingProductId === product.id ? (
                        <input
                          className="admin-edit-input"
                          type="text"
                          name="title"
                          value={editData.title}
                          onChange={handleEditChange}
                        />
                      ) : (
                        product.title
                      )}
                    </td>

                    <td>{product.category}</td>

                    <td>
                      {editingProductId === product.id ? (
                        <input
                          className="admin-edit-input"
                          type="number"
                          name="price"
                          value={editData.price}
                          onChange={handleEditChange}
                        />
                      ) : (
                        `${Number(product.price).toLocaleString()} ₸`
                      )}
                    </td>

                    <td>
                      {editingProductId === product.id ? (
                        <input
                          className="admin-edit-input"
                          type="text"
                          name="size"
                          value={editData.size}
                          onChange={handleEditChange}
                          placeholder="S, M, L"
                        />
                      ) : (
                        Array.isArray(product.size)
                          ? product.size.join(", ")
                          : "—"
                      )}
                    </td>

                    <td>
                      {editingProductId === product.id ? (
                        <label className="admin-check">
                          <input
                            type="checkbox"
                            name="inStock"
                            checked={editData.inStock}
                            onChange={handleEditChange}
                          />
                          В наличии
                        </label>
                      ) : product.in_stock ? (
                        <span className="admin-badge admin-badge--green">
                          В наличии
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge--red">
                          Нет
                        </span>
                      )}
                    </td>

                    <td>
                      {editingProductId === product.id ? (
                        <div className="admin-table-actions">
                          <button
                            className="admin-action-btn admin-action-btn--save"
                            onClick={() => saveProduct(product.id)}
                          >
                            Сохранить
                          </button>

                          <button
                            className="admin-action-btn admin-action-btn--cancel"
                            onClick={cancelEdit}
                          >
                            Отмена
                          </button>
                        </div>
                      ) : (
                        <button
                          className="admin-action-btn"
                          onClick={() => startEdit(product)}
                        >
                          Редактировать
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminProductsPage;