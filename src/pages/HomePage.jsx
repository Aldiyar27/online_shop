import { useEffect, useState } from "react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getProducts } from "../services/api";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(data.slice(0, 4));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message || "Не удалось загрузить товары с сервера");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Header />
      <Hero />

      <section className="popular">
        <div className="popular__top">
          <span className="popular__label">Популярное</span>
          <h2 className="popular__title">Популярные товары</h2>
          <p className="popular__description">
            Выбирай лучшие товары из нашего каталога.
          </p>
        </div>

        {isLoading && <p className="catalog__empty">Загрузка товаров...</p>}
        {loadError && <p className="catalog__empty">{loadError}</p>}

        <div className="popular__grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
