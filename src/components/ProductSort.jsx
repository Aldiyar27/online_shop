import "../styles/ProductSort.css";

function ProductSort({ sortType, setSortType }) {
  return (
    <div className="product-sort">
      <label className="product-sort__label">
        Сортировка:
      </label>

      <select
        className="product-sort__select"
        value={sortType}
        onChange={(event) => setSortType(event.target.value)}
      >
        <option value="default">По умолчанию</option>
        <option value="cheap">Сначала дешевые</option>
        <option value="expensive">Сначала дорогие</option>
      </select>
    </div>
  );
}

export default ProductSort;