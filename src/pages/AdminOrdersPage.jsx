import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getOrders,
  updateOrderStatus
} from "../services/api";
import "../styles/AdminTablePages.css";

function AdminOrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortType, setSortType] = useState("newest");

  function handleLogout() {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  }

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleStatusChange(orderId, newStatus) {
  try {
    const result = await updateOrderStatus(
      orderId,
      newStatus
    );

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: result.order.status
            }
          : order
      )
    );
  } catch (error) {
    setError(error.message);
  }
}

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Поиск
    if (search.trim()) {
      filtered = filtered.filter((order) => {
        const customerName =
          order.customer_name?.toLowerCase() || "";

        const customerPhone =
          order.customer_phone?.toLowerCase() || "";

        return (
          customerName.includes(search.toLowerCase()) ||
          customerPhone.includes(search.toLowerCase())
        );
      });
    }

    // Фильтр статуса
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => {
        if (statusFilter === "completed") {
          return order.status === "completed";
        }

        if (statusFilter === "pending") {
          return !order.status || order.status === "pending";
        }

        return true;
      });
    }

    // Сортировка
    if (sortType === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );
    }

    if (sortType === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.created_at) -
          new Date(b.created_at)
      );
    }

    if (sortType === "expensive") {
      filtered.sort(
        (a, b) =>
          Number(b.total_price) -
          Number(a.total_price)
      );
    }

    if (sortType === "cheap") {
      filtered.sort(
        (a, b) =>
          Number(a.total_price) -
          Number(b.total_price)
      );
    }

    return filtered;
  }, [orders, search, statusFilter, sortType]);

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          AdminPanel
        </div>

        <nav className="admin-sidebar__nav">
          <Link to="/admin" className="admin-sidebar__link">
            Главная
          </Link>

          <Link to="/admin/products" className="admin-sidebar__link">
            Товары
          </Link>

          <Link
            to="/admin/orders"
            className="admin-sidebar__link active"
          >
            Заказы
          </Link>

          <Link to="/admin/users" className="admin-sidebar__link">
            Пользователи
          </Link>

          <Link to="/" className="admin-sidebar__link">
            На сайт
          </Link>
        </nav>

        <button
          className="admin-sidebar__logout"
          onClick={handleLogout}
        >
          Выйти
        </button>
      </aside>

      <section className="admin-content">
        <div className="admin-content__top">
          <div>
            <span className="admin-content__label">
              Заказы
            </span>

            <h1 className="admin-content__title">
              Управление заказами
            </h1>

            <p className="admin-content__description">
              Поиск, фильтрация и просмотр заказов.
            </p>
          </div>
        </div>

        {/* ФИЛЬТРЫ */}

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Поиск по имени или телефону..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="admin-filter-input"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="admin-filter-select"
          >
            <option value="all">Все статусы</option>
            <option value="pending">В ожидании</option>
            <option value="completed">Завершенные</option>
          </select>

          <select
            value={sortType}
            onChange={(event) =>
              setSortType(event.target.value)
            }
            className="admin-filter-select"
          >
            <option value="newest">
              Сначала новые
            </option>

            <option value="oldest">
              Сначала старые
            </option>

            <option value="expensive">
              Сначала дорогие
            </option>

            <option value="cheap">
              Сначала дешевые
            </option>
          </select>
        </div>

        {loading && (
          <p className="admin-message">
            Загрузка заказов...
          </p>
        )}

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
                  <th>Клиент</th>
                  <th>Телефон</th>
                  <th>Адрес</th>
                  <th>Комментарий</th>
                  <th>Сумма</th>
                  <th>Дата</th>
                  <th>Статус</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>

                    <td>{order.customer_name}</td>

                    <td>{order.customer_phone}</td>

                    <td>{order.customer_address}</td>

                    <td>
                      {order.comment || "—"}
                    </td>

                    <td>
                      {Number(
                        order.total_price
                      ).toLocaleString()}{" "}
                      ₸
                    </td>

                    <td>
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString("ru-RU")
                        : "—"}
                    </td>

                    <td>
  <select
    value={order.status || "processing"}
    onChange={(event) =>
      handleStatusChange(
        order.id,
        event.target.value
      )
    }
    className="admin-status-select"
  >
    <option value="processing">
      Processing
    </option>

    <option value="shipped">
      Shipped
    </option>

    <option value="delivered">
      Delivered
    </option>

    <option value="cancelled">
      Cancelled
    </option>
  </select>
</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <p className="admin-empty">
                Заказы не найдены.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminOrdersPage;