import { useEffect, useRef, useState } from "react";

import "../styles/ProductFilter.css";

const categories = [
  { value: "all", label: "Все" },
  { value: "t-shirts", label: "Футболки" },
  { value: "hoodies", label: "Худи" },
  { value: "sweatshirts", label: "Свитшоты" },
  { value: "jeans", label: "Джинсы" },
  { value: "shirts", label: "Рубашки" },
  { value: "jackets", label: "Куртки" },
  { value: "pants", label: "Брюки" },
  { value: "dresses", label: "Платья" },
  { value: "skirts", label: "Юбки" },
  { value: "shoes", label: "Обувь" },
  { value: "accessories", label: "Аксессуары" },
];

function ProductFilter({
  selectedCategory,
  setSelectedCategory
}) {
  const filterRef = useRef(null);

  const [scrollPercent, setScrollPercent] =
    useState(0);

  /*
    UPDATE SCROLLBAR POSITION
  */

  function updateScrollbar() {
    const container = filterRef.current;

    if (!container) return;

    const maxScroll =
      container.scrollWidth -
      container.clientWidth;

    const percent =
      (container.scrollLeft / maxScroll) * 100;

    setScrollPercent(percent || 0);
  }

  /*
    DRAG BLACK THUMB
  */

  function handleThumbMouseDown(event) {
    event.preventDefault();

    const startX = event.clientX;

    const startPercent = scrollPercent;

    function onMouseMove(moveEvent) {
      const container = filterRef.current;

      if (!container) return;

      const deltaX =
        moveEvent.clientX - startX;

      const containerWidth =
        container.clientWidth;

      const movePercent =
        (deltaX / containerWidth) * 100;

      const newPercent =
        startPercent + movePercent;

      const maxScroll =
        container.scrollWidth -
        container.clientWidth;

      container.scrollLeft =
        (newPercent / 100) * maxScroll;
    }

    function onMouseUp() {
      window.removeEventListener(
        "mousemove",
        onMouseMove
      );

      window.removeEventListener(
        "mouseup",
        onMouseUp
      );
    }

    window.addEventListener(
      "mousemove",
      onMouseMove
    );

    window.addEventListener(
      "mouseup",
      onMouseUp
    );
  }

  useEffect(() => {
    const container = filterRef.current;

    if (!container) return;

    updateScrollbar();

    container.addEventListener(
      "scroll",
      updateScrollbar
    );

    window.addEventListener(
      "resize",
      updateScrollbar
    );

    return () => {
      container.removeEventListener(
        "scroll",
        updateScrollbar
      );

      window.removeEventListener(
        "resize",
        updateScrollbar
      );
    };
  }, []);

  return (
    <div className="filter-wrapper">
      <div
        ref={filterRef}
        className="product-filter"
      >
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            className={
              selectedCategory === category.value
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setSelectedCategory(category.value)
            }
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* CUSTOM DRAG SCROLLBAR */}

      <div className="filter-scrollbar">
        <div
          className="filter-scrollbar__thumb"
          style={{
            left: `${scrollPercent}%`
          }}
          onMouseDown={handleThumbMouseDown}
        ></div>
      </div>
    </div>
  );
}

export default ProductFilter;