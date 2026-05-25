import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import "../styles/CartPage.css";

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice,
  } = useCart();

  return (
    <>
      <Header />

      <main className="cart-page">
        <div className="cart-page__top">
          <span className="cart-page__label">Корзина</span>
          <h1 className="cart-page__title">Ваша корзина</h1>
          <p className="cart-page__description">
            Здесь отображаются товары, которые вы добавили в корзину.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Корзина пустая</h2>
            <p>Добавьте товары из каталога, чтобы оформить заказ.</p>

            <Link to="/catalog" className="cart-empty__button">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="cart-page__content">
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item__image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="cart-item__info">
                    <p className="cart-item__category">
                      {item.category}
                    </p>

                    <h3 className="cart-item__title">
                      {item.title}
                    </h3>

                    <p className="cart-item__price">
                      {item.price.toLocaleString()} ₸
                    </p>
                  </div>

                  <div className="cart-item__quantity">
                    <button onClick={() => decreaseQuantity(item.id)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.id)}>
                      +
                    </button>
                  </div>

                  <div className="cart-item__total">
                    {(item.price * item.quantity).toLocaleString()} ₸
                  </div>

                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Итого</h2>

              <div className="cart-summary__row">
                <span>Товары:</span>
                <strong>{cartItems.length}</strong>
              </div>

              <div className="cart-summary__row">
                <span>Сумма:</span>
                <strong>{totalPrice.toLocaleString()} ₸</strong>
              </div>

              <Link to="/checkout" className="cart-summary__button">
                Оформить заказ
              </Link>

              <button
                className="cart-summary__clear"
                onClick={clearCart}
              >
                Очистить корзину
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default CartPage;