import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import "../styles/CheckoutPage.css";

function getCurrentUser() {
  try {
    const userFromStorage = localStorage.getItem("currentUser");
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  } catch {
    return null;
  }
}

function getUserFormData() {
  const user = getCurrentUser();

  if (!user) {
    return {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      comment: "",
    };
  }
  const { cartItems } = useCart();
  const totalPrice = cartItems.reduce(
  (total, item) =>
    total + item.price * item.quantity,
  0
);

  const nameParts = (user.name || "").split(" ");

  return {
    firstName: nameParts[0] || "",
    lastName: nameParts[1] || "",
    phone: user.phone || "",
    email: user.email || "",
    address: user.address || "",
    comment: "",
  };
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState(getUserFormData);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = getCurrentUser();
  const deliveryPrice = totalPrice > 0 ? 1500 : 0;
  const finalPrice = totalPrice + deliveryPrice;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function validateForm() {
    const newErrors = {};
    const nameRegex = /^[A-Za-zА-Яа-яЁёҚқӘәІіҢңҒғҮүҰұӨөҺһ]{1,15}$/;
    const phoneRegex = /^[0-9]{11}$/;

    if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = "Имя должно содержать от 1 до 15 символов и только буквы";
    }

    if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Фамилия должна содержать от 1 до 15 символов и только буквы";
    }

    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Номер должен содержать ровно 11 цифр";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Введите адрес доставки";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Корзина пустая");
      return;
    }

    const orderData = {
      userId: currentUser?.id || null,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      comment: formData.comment,
      items: cartItems.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      setIsSubmitting(true);
      await createOrder(orderData);
      clearCart();
      navigate("/profile");
    } catch (error) {
      setSubmitError(error.message || "Не удалось оформить заказ");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <main className="checkout">
        <div className="checkout__top">
          <span className="checkout__label">Оформление</span>

          <h1 className="checkout__title">Оформление заказа</h1>

          <p className="checkout__description">
            Данные профиля автоматически подставляются в форму заказа.
          </p>
        </div>

        <div className="checkout__content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2 className="checkout-form__title">Данные покупателя</h2>

            <div className="checkout-form__grid">
              <div className="checkout-form__group">
                <label>Имя</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Введите имя"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="checkout-form__error">{errors.firstName}</p>}
              </div>

              <div className="checkout-form__group">
                <label>Фамилия</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Введите фамилию"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="checkout-form__error">{errors.lastName}</p>}
              </div>
            </div>

            <div className="checkout-form__group">
              <label>Телефон</label>
              <input
                type="tel"
                name="phone"
                placeholder="87071234567"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="checkout-form__error">{errors.phone}</p>}
            </div>

            <div className="checkout-form__group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="checkout-form__error">{errors.email}</p>}
            </div>

            <div className="checkout-form__group">
              <label>Адрес доставки</label>
              <input
                type="text"
                name="address"
                placeholder="Город, улица, дом, квартира"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <p className="checkout-form__error">{errors.address}</p>}
            </div>

            <div className="checkout-form__group">
              <label>Комментарий к заказу</label>
              <textarea
                name="comment"
                placeholder="Например: доставить после 18:00"
                value={formData.comment}
                onChange={handleChange}
              />
            </div>

            {submitError && <p className="checkout-form__error">{submitError}</p>}

            <Link className="checkout-form__button" to="/payment" disabled={isSubmitting}>
              {isSubmitting ? "Оформляем..." : "Начать оплату"}
            </Link>
          </form>

          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">Итоги заказа</h2>

            {cartItems.length === 0 ? (
              <p className="checkout-summary__empty">Корзина пустая</p>
            ) : (
              <div className="checkout-summary__items">
                {cartItems.map((item) => (
                  <div className="checkout-summary__item" key={item.id}>
                    <img src={item.image} alt={item.title} />

                    <div>
                      <h3>{item.title}</h3>
                      <p>
                        {item.quantity} × {item.price.toLocaleString()} ₸
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="checkout-summary__line">
              <span>Товары</span>
              <strong>{totalPrice.toLocaleString()} ₸</strong>
            </div>

            <div className="checkout-summary__line">
              <span>Доставка</span>
              <strong>{deliveryPrice.toLocaleString()} ₸</strong>
            </div>

            <div className="checkout-summary__total">
              <span>Итого</span>
              <strong>{finalPrice.toLocaleString()} ₸</strong>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default CheckoutPage;
