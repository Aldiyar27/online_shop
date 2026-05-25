import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminUsers } from "../services/api";
import "../styles/AdminTablePages.css";

function AdminUsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleLogout() {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  }

  useEffect(() => {
    getAdminUsers()
      .then((data) => {
        setUsers(data);
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
        <div className="admin-sidebar__logo">AdminPanel</div>

        <nav className="admin-sidebar__nav">
          <Link to="/admin" className="admin-sidebar__link">Главная</Link>
          <Link to="/admin/products" className="admin-sidebar__link">Товары</Link>
          <Link to="/admin/orders" className="admin-sidebar__link">Заказы</Link>
          <Link to="/admin/users" className="admin-sidebar__link active">Пользователи</Link>
          <Link to="/" className="admin-sidebar__link">На сайт</Link>
        </nav>

        <button className="admin-sidebar__logout" onClick={handleLogout}>
          Выйти
        </button>
      </aside>

      <section className="admin-content">
        <div className="admin-content__top">
          <div>
            <span className="admin-content__label">Пользователи</span>
            <h1 className="admin-content__title">Список пользователей</h1>
            <p className="admin-content__description">
              Пользователи загружаются из PostgreSQL.
            </p>
          </div>
        </div>

        {loading && <p className="admin-message">Загрузка пользователей...</p>}

        {error && (
          <p className="admin-message admin-message--error">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Адрес</th>
                  <th>Дата регистрации</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "—"}</td>
                    <td>{user.address || "—"}</td>

                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString("ru-RU")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="admin-empty">
                Пользователей пока нет.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminUsersPage;