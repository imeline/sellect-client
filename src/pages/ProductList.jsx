import {useEffect, useState} from "react";
import ProductFilters from "../components/ProductFilters.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { priceRanges} from "./constants.js";
import {useLocation} from "react-router-dom";
import axios from "axios";

export default function ProductList() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", brand: "", minPrice: 0, maxPrice: 500000 });
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [customPrice, setCustomPrice] = useState(false);
  const [sortType, setSortType] = useState("rating-desc");
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: API_BASE_URL 환경 변수로 변경
        const response = await axios.get("http://localhost:8080/api/v1/search/products", {
          params: { keyword, page }, // TODO: 검색 필터 추가
        });
        setProducts(prev => [...prev, ...response.data['result']['content']]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (keyword) {
      fetchProducts();
    }
  }, [keyword, filters, selectedPrice, customPrice, sortType, page]);



  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePriceFilter = (index) => {
    if (index === selectedPrice) return;
    setSelectedPrice(index);
    setCustomPrice(false);
    setFilters({ ...filters, minPrice: priceRanges[index].min, maxPrice: priceRanges[index].max });
  };

  const applyCustomPrice = () => {
    setSelectedPrice(null);
    setCustomPrice(true);
  };

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
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
        products={products}
        filters={filters}
        sortType={sortType}
        onSortChange={handleSortChange}
        onLoadMore={loadMore}
        isLastPage={isLastPage}
      />
    </div>
  );
}