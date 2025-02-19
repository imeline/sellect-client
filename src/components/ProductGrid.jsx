import { allProducts } from "../pages/constants";
import ProductItem from "./ProductItem";

export default function ProductGrid({ filters, sortType, visibleCount, onSortChange, onLoadMore }) {
  const sortedProducts = [...allProducts].sort((a, b) => {
    if (sortType === "price-asc") return a.price - b.price;
    if (sortType === "price-desc") return b.price - a.price;
    if (sortType === "rating-desc") return b.rating - a.rating;
    return 0;
  });

  const filteredProducts = sortedProducts.filter(
    (product) =>
      (!filters.category || product.category === filters.category) &&
      (!filters.brand || product.brand === filters.brand) &&
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice
  );

  return (
    <div className="w-3/4 pl-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">상품 리스트</h1>
        <select onChange={(e) => onSortChange(e.target.value)} value={sortType} className="p-2 border rounded">
          <option value="latest-desc">신상품순</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="price-desc">가격 높은순</option>
          <option value="rating-desc">후기순</option>
        </select>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
      {visibleCount < filteredProducts.length && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}