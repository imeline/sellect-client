import {useEffect, useState} from "react";
import ProductFilters from "../components/ProductFilters.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { priceRanges} from "./constants.js";
import {useLocation} from "react-router-dom";
import axios from "axios";

const ITEMS_PER_PAGE = 20;

export default function ProductList() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [filters, setFilters] = useState({ category: "", brand: "", minPrice: 0, maxPrice: 500000 });
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [customPrice, setCustomPrice] = useState(false);
  const [sortType, setSortType] = useState("rating-desc");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: API_BASE_URL 환경 변수로 변경
        const response = await axios.get("http://localhost:8080/api/v1/search/products", {
          params: { keyword }, // TODO: 검색 필터 추가
        });
        setProducts(response.data['result']['content']); // TODO: 데이터 형식에 맞게 수정
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (keyword) {
      fetchProducts();
    }
  }, [keyword, filters, selectedPrice, customPrice, sortType]);



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
        products={products}
        filters={filters}
        sortType={sortType}
        visibleCount={visibleCount}
        onSortChange={handleSortChange}
        onLoadMore={loadMore}
      />
    </div>
  );
}