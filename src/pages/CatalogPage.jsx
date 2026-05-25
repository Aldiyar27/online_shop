import { useEffect, useState } from "react";

import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import ProductSort from "../components/ProductSort";
import ProductSearch from "../components/ProductSearch";
import Footer from "../components/Footer";
import { getProducts } from "../services/api";
import "../styles/CatalogPage.css";
import ProductCardSkeleton
from "../components/ProductCardSkeleton";

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortType, setSortType] = useState("default");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
useEffect(() => {
  async function fetchProducts() {
    try {
      setLoading(true);

      /*
        FAKE LOADING
      */

      await new Promise((resolve) => {
        setTimeout(resolve, 2500);
      });

      const data =
        await getProducts();

      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  fetchProducts();
}, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      setLoadError("");

      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
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

  const filteredProducts = products
    .filter((product) => selectedCategory === "all" || product.category === selectedCategory)
    .filter((product) => product.title.toLowerCase().includes(searchText.toLowerCase()));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortType === "cheap") {
      return a.price - b.price;
    }

    if (sortType === "expensive") {
      return b.price - a.price;
    }

    return a.id - b.id;
  });

  return (
    <>
      <Header />

      <main className="catalog">
        <div className="catalog__top">
          <span className="catalog__label">Каталог</span>

          <h1 className="catalog__title">Все товары</h1>

          <p className="catalog__description">
            Выбирай одежду, обувь и аксессуары из нашего интернет-магазина.
          </p>
        </div>

        <ProductSearch searchText={searchText} setSearchText={setSearchText} />

        <ProductFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <ProductSort sortType={sortType} setSortType={setSortType} />

        {isLoading && <p className="catalog__empty">Загрузка товаров...</p>}
        {loadError && <p className="catalog__empty">{loadError}</p>}

        <div className="catalog__grid">
          {loading ? (
  [...Array(8)].map((_, index) => (
    <ProductCardSkeleton
      key={index}
    />
  ))
) : (
  sortedProducts.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
    />
  ))
)}
        </div>
        {!isLoading && !loadError && sortedProducts.length === 0 && (
          <p className="catalog__empty">Товар не найден</p>
        )}
      </main>

      <Footer />
    </>
  );
}

export default CatalogPage;
