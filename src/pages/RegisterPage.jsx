import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { registerUser } from "../services/api";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function hasSequentialNumbers(password) {
    const sequences = ["012", "123", "234", "345", "456", "567", "678", "789"];
    return sequences.some((sequence) => password.includes(sequence));
  }

  function validateForm() {
    const newErrors = {};

    const nameRegex = /^[A-Za-zА-Яа-яЁёҚқӘәІіҢңҒғҮүҰұӨөҺһ]{1,15}$/;
    const upperCaseRegex = /[A-ZА-ЯЁҚӘІҢҒҮҰӨҺ]/;
    const digitRegex = /\d/;
    const specialSymbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

    if (!nameRegex.test(formData.name)) {
      newErrors.name = "Имя должно быть от 1 до 15 символов и содержать только буквы";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    }

    if (!upperCaseRegex.test(formData.password)) {
      newErrors.password = "Пароль должен содержать хотя бы одну заглавную букву";
    } else if (!digitRegex.test(formData.password)) {
      newErrors.password = "Пароль должен содержать хотя бы одну цифру";
    } else if (!specialSymbolRegex.test(formData.password)) {
      newErrors.password = "Пароль должен содержать хотя бы один спецсимвол";
    } else if (hasSequentialNumbers(formData.password)) {
      newErrors.password = "Цифры в пароле не должны идти по порядку, например 123 или 456";
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setMessage(result.message || "Пользователь успешно зарегистрирован");

      if (result.user) {
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        window.dispatchEvent(new Event("auth-change"));
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
      });
      setErrors({});
      navigate("/profile");
    } catch (error) {
      setMessage(error.message || "Не удалось зарегистрироваться");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <main className="register-page">
        <div className="register-card">
          <div className="register-card__top">
            <span className="register-card__label">Аккаунт</span>

            <h1 className="register-card__title">Регистрация</h1>

            <p className="register-card__description">
              Создайте аккаунт, чтобы оформлять заказы и сохранять товары в корзине.
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-form__group">
              <label>Имя</label>

              <input
                type="text"
                name="name"
                placeholder="Введите имя"
                value={formData.name}
                onChange={handleChange}
              />

              {errors.name && <p className="register-form__error">{errors.name}</p>}
            </div>

            <div className="register-form__group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && <p className="register-form__error">{errors.email}</p>}
            </div>

            <div className="register-form__group">
              <label>Пароль</label>

              <input
                type="password"
                name="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
              />

              <p className="register-form__hint">
                Пароль должен содержать заглавную букву, цифру, спецсимвол.
                Цифры не должны идти по порядку, например 123 или 456.
              </p>

              {errors.password && <p className="register-form__error">{errors.password}</p>}
            </div>

            <div className="register-form__group">
              <label>Повторный пароль</label>

              <input
                type="password"
                name="repeatPassword"
                placeholder="Повторите пароль"
                value={formData.repeatPassword}
                onChange={handleChange}
              />

              {errors.repeatPassword && (
                <p className="register-form__error">{errors.repeatPassword}</p>
              )}
            </div>

            {message && <p className="register-form__message">{message}</p>}

            <button className="register-form__button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default RegisterPage;
