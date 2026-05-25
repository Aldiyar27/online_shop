import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const isInStock = product.inStock !== false;

  function openProductPage() {
    navigate(`/product/${product.id}`);
  }

  function handleAddToCart(event) {
    event.stopPropagation();
    addToCart(product);
  }

  return (
    <div className="product-card" onClick={openProductPage} role="button" tabIndex={0}>
      <div className="product-card__image">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="product-card__content">
        <p className="product-card__category">{product.category}</p>

        <h3 className="product-card__title">{product.title}</h3>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__bottom">
          <span className="product-card__price">
            {product.price.toLocaleString()} ₸
          </span>

          <button
            type="button"
            className="product-card__button"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            {isInStock ? "+" : "Нет"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
