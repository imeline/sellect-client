import { useState } from "react";
import ProductFilters from "../components/ProductFilters.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { priceRanges} from "./constants.js";

const ITEMS_PER_PAGE = 20;

export default function ProductList() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [filters, setFilters] = useState({ category: "", brand: "", minPrice: 0, maxPrice: 500000 });
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [customPrice, setCustomPrice] = useState(false);
  const [sortType, setSortType] = useState("rating-desc");

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handlePriceFilter = (index) => {
    if (index === selectedPrice) return;
    setSelectedPrice(index);
    setCustomPrice(false);
    setFilters({ ...filters, minPrice: priceRanges[index].min, maxPrice: priceRanges[index].max });
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const applyCustomPrice = () => {
    setSelectedPrice(null);
    setCustomPrice(true);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
  };

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8">
      <ProductFilters
        filters={filters}
        selectedPrice={selectedPrice}
        customPrice={customPrice}
        onFilterChange={handleFilterChange}
        onPriceFilter={handlePriceFilter}
        onCustomPriceApply={applyCustomPrice}
      />
      <ProductGrid
        filters={filters}
        sortType={sortType}
        visibleCount={visibleCount}
        onSortChange={handleSortChange}
        onLoadMore={loadMore}
      />
    </div>
  );
}