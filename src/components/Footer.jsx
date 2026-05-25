import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <h2 className="footer__logo">MyShop Market</h2>
          <p className="footer__text">
            Современный интернет-магазин в мягком минималистичном стиле:
            техника, аксессуары и товары для учебы, работы и жизни.
          </p>
        </div>

        <nav className="footer__nav">
          <h3 className="footer__title">Навигация</h3>

          <Link to="/" className="footer__link">Главная</Link>
          <Link to="/catalog" className="footer__link">Каталог</Link>
          <Link to="/cart" className="footer__link">Корзина</Link>
        </nav>

        <div className="footer__contacts">
          <h3 className="footer__title">Контакты</h3>

          <p className="footer__item">Телефон: +7 777 123 45 67</p>
          <p className="footer__item">Email: info@myshop.kz</p>
          <p className="footer__item">Город: Астана</p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2026 MyShop Market. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;
