import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <span className="hero__label">Новая коллекция</span>

        <h1 className="hero__title">
          Минималистичные товары для твоего дня
        </h1>

        <p className="hero__description">
          Выбирай технику, аксессуары и полезные устройства в спокойном
          современном интерфейсе с удобным каталогом, поиском и сортировкой.
        </p>

        <Link to="/catalog" className="hero__button">
          Смотреть каталог
        </Link>
      </div>

      <div className="hero__decor">
        <div className="product-card">
          <div className="product-card__badge">Хит продаж</div>

          <div className="product-card__image">
            <img src={heroImage} alt="Товар недели" />
          </div>

          <div className="product-card__info">
            <h3>Soft Tech Set</h3>
            <p>Аксессуары для работы</p>

            <div className="product-card__bottom">
              <span>119 990 ₸</span>
              <button>+</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
