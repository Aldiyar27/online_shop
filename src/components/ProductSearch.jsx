import "../styles/ProductSearch.css";

function ProductSearch({ searchText, setSearchText }) {
  return (
    <div className="product-search">
      <input
        className="product-search__input"
        type="text"
        placeholder="Поиск товара по названию..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
    </div>
  );
}

export default ProductSearch;