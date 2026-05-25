import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getProductById } from "../services/api";

import "../styles/ProductPage.css";

function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoading(true);
      setLoadError("");

      try {
        const data = await getProductById(id);

        if (isMounted) {
          setProduct(data);
        }
      } catch (error) {
        if (isMounted) {
          setProduct(null);
          setLoadError(error.message || "Не удалось загрузить товар");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="product-page product-page--empty">
          <h1>Загрузка...</h1>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />

        <main className="product-page product-page--empty">
          <h1>Товар не найден</h1>
          <p>{loadError || "Такого товара нет в нашем каталоге."}</p>

          <Link to="/catalog" className="product-page__back">
            Вернуться в каталог
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const isInStock = product.inStock !== false;

  return (
    <>
      <Header />

      <main className="product-page">
        <div className="product-page__container">
          <div className="product-page__image-box">
            <img
              src={product.image}
              alt={product.title}
              className="product-page__image"
            />
          </div>

          <div className="product-page__info">
            <p className="product-page__category">{product.category}</p>

            <h1 className="product-page__title">{product.title}</h1>

            <p className="product-page__description">{product.description}</p>

            <div className="product-page__details">
              {product.brand && (
                <p>
                  <span>Бренд:</span> {product.brand}
                </p>
              )}

              {product.material && (
                <p>
                  <span>Материал:</span> {product.material}
                </p>
              )}

              {product.color && (
                <p>
                  <span>Цвет:</span> {product.color}
                </p>
              )}

              {product.size && product.size.length > 0 && (
                <p>
                  <span>Размеры:</span> {product.size.join(", ")}
                </p>
              )}

              <p>
                <span>Наличие:</span> {isInStock ? "В наличии" : "Нет в наличии"}
              </p>
            </div>

            <div className="product-page__bottom">
              <strong className="product-page__price">
                {product.price.toLocaleString()} ₸
              </strong>

              <button
                className="product-page__button"
                onClick={() => addToCart(product)}
                disabled={!isInStock}
              >
                {isInStock ? "Добавить в корзину" : "Нет в наличии"}
              </button>
            </div>

            <Link to="/catalog" className="product-page__link">
              ← Назад в каталог
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProductPage;
