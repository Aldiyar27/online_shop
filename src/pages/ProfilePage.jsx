import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getOrders, updateUser } from "../services/api";

import "../styles/ProfilePage.css";

function getCurrentUser() {
  try {
    const userFromStorage = localStorage.getItem("currentUser");
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  } catch {
    return null;
  }
}

function createEditData(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  };
}

function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState("");
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(() => createEditData(getCurrentUser()));
  const [editError, setEditError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  useEffect(() => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) return;

  getOrders()
    .then((data) => {
      const userOrders = data.filter(
        (order) =>
          order.customer_name === user.name
      );

      setOrders(userOrders);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoadingOrders(false);
    });
}, []);

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    let isMounted = true;

    async function loadOrders() {
      setIsOrdersLoading(true);
      setOrdersError("");

      try {
        const data = await getOrders(currentUser.id);

        if (isMounted) {
          setOrders(data);
        }
      } catch (error) {
        if (isMounted) {
          setOrdersError(error.message || "Не удалось загрузить историю заказов");
        }
      } finally {
        if (isMounted) {
          setIsOrdersLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("auth-change"));
    setCurrentUser(null);
    navigate("/");
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditData({
      ...editData,
      [name]: value,
    });
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    setEditError("");

    try {
      setIsSaving(true);

      const result = await updateUser(currentUser.id, {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
      });

      const updatedUser = result.user;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("auth-change"));
      setCurrentUser(updatedUser);
      setEditData(createEditData(updatedUser));
      setIsEditing(false);
    } catch (error) {
      setEditError(error.message || "Не удалось сохранить профиль");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Header />

      <main className="profile-page">
        <section className="profile-hero">
          <span className="profile-hero__label">Личный кабинет</span>

          <h1 className="profile-hero__title">Профиль пользователя</h1>

          <p className="profile-hero__description">
            Здесь можно посмотреть данные аккаунта, отредактировать профиль,
            выйти из системы и увидеть историю заказов.
          </p>
        </section>

        <section className="profile-container">
          {currentUser ? (
            <>
              <div className="profile-card">
                <div className="profile-card__avatar">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </div>

                <div className="profile-card__info">
                  <h2 className="profile-card__name">{currentUser.name}</h2>
                  <p className="profile-card__email">{currentUser.email}</p>
                </div>

                {!isEditing ? (
                  <>
                    <div className="profile-card__details">
                      <div className="profile-card__item">
                        <span>Имя</span>
                        <strong>{currentUser.name || "Не указано"}</strong>
                      </div>

                      <div className="profile-card__item">
                        <span>Email</span>
                        <strong>{currentUser.email || "Не указано"}</strong>
                      </div>

                      <div className="profile-card__item">
                        <span>Телефон</span>
                        <strong>{currentUser.phone || "Не указано"}</strong>
                      </div>

                      <div className="profile-card__item">
                        <span>Адрес</span>
                        <strong>{currentUser.address || "Не указано"}</strong>
                      </div>
                    </div>

                    <div className="profile-card__actions">
                      <button
                        className="profile-card__edit"
                        type="button"
                        onClick={() => setIsEditing(true)}
                      >
                        Редактировать профиль
                      </button>

                      <button
                        className="profile-card__logout"
                        type="button"
                        onClick={handleLogout}
                      >
                        Выйти
                      </button>
                    </div>
                  </>
                ) : (
                  <form className="profile-edit" onSubmit={handleSaveProfile}>
                    <div className="profile-edit__group">
                      <label>Имя</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        placeholder="Введите имя"
                      />
                    </div>

                    <div className="profile-edit__group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        placeholder="Введите email"
                      />
                    </div>

                    <div className="profile-edit__group">
                      <label>Телефон</label>
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        placeholder="87071234567"
                      />
                    </div>

                    <div className="profile-edit__group">
                      <label>Адрес</label>
                      <input
                        type="text"
                        name="address"
                        value={editData.address}
                        onChange={handleEditChange}
                        placeholder="Город, улица, дом"
                      />
                    </div>

                    {editError && <p className="register-form__error">{editError}</p>}

                    <div className="profile-edit__actions">
                      <button className="profile-edit__save" type="submit" disabled={isSaving}>
                        {isSaving ? "Сохраняем..." : "Сохранить"}
                      </button>

                      <button
                        className="profile-edit__cancel"
                        type="button"
                        onClick={() => {
                          setEditData(createEditData(currentUser));
                          setIsEditing(false);
                          setEditError("");
                        }}
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="profile-orders">
                <div className="profile-orders__top">
                  <h2>История заказов</h2>
                  <p>Здесь отображаются ваши оформленные заказы.</p>
                </div>

                {isOrdersLoading && <p>Загрузка заказов...</p>}
                {ordersError && <p>{ordersError}</p>}

                {!isOrdersLoading && !ordersError && orders.length === 0 ? (
                  <div className="profile-orders__empty">
                    <p>У вас пока нет заказов.</p>

                    <Link to="/catalog" className="profile-orders__link">
                      Перейти в каталог
                    </Link>
                  </div>
                ) : (
                  <div className="profile-orders__list">
                    {orders.map((order) => (
                      <div className="profile-order" key={order.id}>
                        <div className="profile-order__header">
                          <div>
                            <h3>Заказ №{order.id}</h3>
                            <p>{order.created_at || "Дата не указана"}</p>
                          </div>

                          <strong>{Number(order.total_price || 0).toLocaleString()} ₸</strong>
                        </div>

                        <div className="profile-order__items">
                          {(order.items || []).map((item) => (
                            <div className="profile-order__item" key={item.id || item.productId}>
                              <img src={item.image} alt={item.title} />

                              <div>
                                <h4>{item.title}</h4>
                                <p>
                                  {item.quantity} × {Number(item.price).toLocaleString()} ₸
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
              {order.status === "processing" && (
                <span className="profile-status profile-status--orange">
                  Processing
                </span>
              )}

              {order.status === "shipped" && (
                <span className="profile-status profile-status--blue">
                  Shipped
                </span>
              )}

              {order.status === "delivered" && (
                <span className="profile-status profile-status--green">
                  Delivered
                </span>
              )}

              {order.status === "cancelled" && (
                <span className="profile-status profile-status--red">
                  Cancelled
                </span>
              )}
            </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="profile-empty">
              <h2>Вы не вошли в аккаунт</h2>

              <p>
                Чтобы открыть личный кабинет, сначала войдите или зарегистрируйтесь.
              </p>

              <div className="profile-empty__actions">
                <Link to="/login" className="profile-empty__login">
                  Войти
                </Link>

                <Link to="/register" className="profile-empty__register">
                  Регистрация
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ProfilePage;
