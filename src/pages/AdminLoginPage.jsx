import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/AdminLoginPage.css";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const ADMIN_EMAIL = "admin@mail.ru";
  const ADMIN_PASSWORD = "Admin123!";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Введите пароль";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setErrors({});

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    if (
      formData.email !== ADMIN_EMAIL ||
      formData.password !== ADMIN_PASSWORD
    ) {
      setErrors({
        login: "Неверный email или пароль администратора"
      });

      return;
    }

    const adminUser = {
      email: ADMIN_EMAIL,
      role: "admin"
    };

    localStorage.setItem("adminUser", JSON.stringify(adminUser));

    setMessage("Вы успешно вошли как администратор");

    setTimeout(() => {
      navigate("/admin");
    }, 1000);
  }

  return (
    <>
      <Header />

      <main className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-card__top">
            <span className="admin-login-card__label">
              Admin
            </span>

            <h1 className="admin-login-card__title">
              Вход администратора
            </h1>

            <p className="admin-login-card__description">
              Введите учебные данные администратора, чтобы перейти в панель управления.
            </p>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-login-form__group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="admin@mail.ru"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && (
                <p className="admin-login-form__error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="admin-login-form__group">
              <label>Пароль</label>

              <input
                type="password"
                name="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
              />

              {errors.password && (
                <p className="admin-login-form__error">
                  {errors.password}
                </p>
              )}
            </div>

            {errors.login && (
              <p className="admin-login-form__error admin-login-form__error--center">
                {errors.login}
              </p>
            )}

            {message && (
              <p className="admin-login-form__success">
                {message}
              </p>
            )}

            <div className="admin-login-form__hint">
              <p>
                <strong>Учебный email:</strong> admin@mail.ru
              </p>
              <p>
                <strong>Учебный пароль:</strong> Admin123!
              </p>
            </div>

            <button className="admin-login-form__button" type="submit">
              Войти как администратор
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminLoginPage;