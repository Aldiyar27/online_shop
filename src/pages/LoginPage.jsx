import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { loginUser } from "../services/api";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function validateLogin() {
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

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setUser(null);

    if (!validateLogin()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      setUser(result.user);
      setMessage(result.message || `Вы успешно вошли, ${result.user.name}!`);
      localStorage.setItem("currentUser", JSON.stringify(result.user));
      window.dispatchEvent(new Event("auth-change"));

      setFormData({
        email: "",
        password: "",
      });

      setErrors({});
      navigate("/");
    } catch (error) {
      setErrors({ login: error.message || "Неверный email или пароль" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <main className="login-page">
        <div className="login-card">
          <div className="login-card__top">
            <span className="login-card__label">Аккаунт</span>

            <h1 className="login-card__title">Вход</h1>

            <p className="login-card__description">
              Войдите в аккаунт, чтобы оформлять заказы и пользоваться корзиной.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form__group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && <p className="login-form__error">{errors.email}</p>}
            </div>

            <div className="login-form__group">
              <label>Пароль</label>

              <input
                type="password"
                name="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
              />

              {errors.password && <p className="login-form__error">{errors.password}</p>}
            </div>

            {errors.login && (
              <p className="login-form__error login-form__error--center">
                {errors.login}
              </p>
            )}

            {message && <p className="login-form__success">{message}</p>}

            {user && (
              <div className="login-user">
                <p>
                  <strong>Пользователь:</strong> {user.name}
                </p>

                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            )}

            <button className="login-form__button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default LoginPage;
