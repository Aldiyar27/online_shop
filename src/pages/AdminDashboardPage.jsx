import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminStats } from "../services/api";
import "../styles/AdminDashboardPage.css";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    productsCount: 0,
    usersCount: 0,
    ordersCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleLogout() {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  }

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          AdminPanel
        </div>

        <nav className="admin-sidebar__nav">
          <Link to="/admin" className="admin-sidebar__link active">
            Главная
          </Link>

          <Link to="/admin/products" className="admin-sidebar__link">
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
            <span className="admin-content__label">
              Панель управления
            </span>

            <h1 className="admin-content__title">
              Админка интернет-магазина
            </h1>

            <p className="admin-content__description">
              Управляйте товарами, заказами и пользователями магазина.
            </p>
          </div>

          <Link to="/admin/products/create" className="admin-content__button">
            + Добавить товар
          </Link>
        </div>

        {loading && (
          <p className="admin-message">
            Загрузка статистики...
          </p>
        )}

        {error && (
          <p className="admin-message admin-message--error">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="admin-stats">
            <div className="admin-stat-card">
              <span>Товары</span>
              <strong>{stats.productsCount}</strong>
              <p>Всего товаров в каталоге</p>
            </div>

            <div className="admin-stat-card">
              <span>Заказы</span>
              <strong>{stats.ordersCount}</strong>
              <p>Всего оформленных заказов</p>
            </div>

            <div className="admin-stat-card">
              <span>Пользователи</span>
              <strong>{stats.usersCount}</strong>
              <p>Зарегистрированные клиенты</p>
            </div>
          </div>
        )}

        <div className="admin-panel">
          <h2>Быстрые действия</h2>

          <div className="admin-actions">
            <Link to="/admin/products/create">Добавить товар</Link>
            <Link to="/admin/orders">Посмотреть заказы</Link>
            <Link to="/catalog">Открыть каталог</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboardPage;