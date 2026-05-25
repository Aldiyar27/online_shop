import { useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { useCart } from "../context/CartContext";

import { processPayment } from "../services/api";

import "../styles/PaymentPage.css";

function PaymentPage() {
  const { cartItems = [], totalPrice = 0 } =
    useCart();

  const [loading, setLoading] =
    useState(false);

  const [successMessage,
    setSuccessMessage] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [formData, setFormData] =
    useState({
      cardName: "",
      cardNumber: "",
      expireDate: "",
      cvv: ""
    });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function validateForm() {
    const newErrors = {};

    if (
      formData.cardName.trim().length < 2
    ) {
      newErrors.cardName =
        "Введите имя владельца карты";
    }

    if (
      !/^\d{16}$/.test(
        formData.cardNumber
      )
    ) {
      newErrors.cardNumber =
        "Номер карты должен содержать 16 цифр";
    }

    if (
      !/^\d{2}\/\d{2}$/.test(
        formData.expireDate
      )
    ) {
      newErrors.expireDate =
        "Формат MM/YY";
    }

    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv =
        "CVV должен содержать 3 цифры";
    }

    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);

      return;
    }

    try {
      setLoading(true);

      setErrors({});

      await new Promise((resolve) => {
        setTimeout(resolve, 2500);
      });

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
      );

      await processPayment({
        email: currentUser?.email,

        customerName:
          currentUser?.name ||
          formData.cardName,

        phone:
          currentUser?.phone ||
          "87000000000",

        address:
          currentUser?.address ||
          "Astana",

        items: cartItems
      });

      setSuccessMessage(
        "Оплата успешно выполнена. Email отправлен."
      );

      setFormData({
        cardName: "",
        cardNumber: "",
        expireDate: "",
        cvv: ""
      });
    } catch (error) {
      setErrors({
        submit:
          error.message ||
          "Ошибка оплаты"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="payment-page">
        <div className="payment-container">
          <div className="payment-left">
            <span className="payment-label">
              Payment
            </span>

            <h1 className="payment-title">
              Оплата заказа
            </h1>

            <p className="payment-description">
              Введите данные банковской карты
              для завершения покупки.
            </p>

            {successMessage && (
              <div className="payment-success">
                {successMessage}
              </div>
            )}

            {errors.submit && (
              <div className="payment-error-box">
                {errors.submit}
              </div>
            )}

            <form
              className="payment-form"
              onSubmit={handleSubmit}
            >
              <div className="payment-group">
                <label>
                  Имя владельца карты
                </label>

                <input
                  type="text"
                  name="cardName"
                  placeholder="Aldiyar Ashkeev"
                  value={formData.cardName}
                  onChange={handleChange}
                />

                {errors.cardName && (
                  <p className="payment-error">
                    {errors.cardName}
                  </p>
                )}
              </div>

              <div className="payment-group">
                <label>
                  Номер карты
                </label>

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="4444333322221111"
                  maxLength={16}
                  value={formData.cardNumber}
                  onChange={handleChange}
                />

                {errors.cardNumber && (
                  <p className="payment-error">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="payment-row">
                <div className="payment-group">
                  <label>
                    Срок действия
                  </label>

                  <input
                    type="text"
                    name="expireDate"
                    placeholder="12/28"
                    maxLength={5}
                    value={formData.expireDate}
                    onChange={handleChange}
                  />

                  {errors.expireDate && (
                    <p className="payment-error">
                      {errors.expireDate}
                    </p>
                  )}
                </div>

                <div className="payment-group">
                  <label>CVV</label>

                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    maxLength={3}
                    value={formData.cvv}
                    onChange={handleChange}
                  />

                  {errors.cvv && (
                    <p className="payment-error">
                      {errors.cvv}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={
                  loading
                    ? "payment-button loading"
                    : "payment-button"
                }
              >
                {loading
                  ? "Обработка оплаты..."
                  : `Оплатить ${Number(
                      totalPrice
                    ).toLocaleString()} ₸`}
              </button>
            </form>
          </div>

          <div className="payment-right">
            <div className="payment-card">
              <div className="payment-chip"></div>

              <div className="payment-card-number">
                •••• •••• •••• ••••
              </div>

              <div className="payment-card-footer">
                <div>
                  <span>Card Holder</span>

                  <strong>
                    {formData.cardName ||
                      "YOUR NAME"}
                  </strong>
                </div>

                <div>
                  <span>Expires</span>

                  <strong>
                    {formData.expireDate ||
                      "MM/YY"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PaymentPage;
