import { useEffect, useState } from "react";
import ProductFilters from "../components/ProductFilters.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { useLocation } from "react-router-dom";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const priceRanges = [
  { label: "전체", min: 0, max: 500000 },
  { label: "$50 이하", min: 0, max: 50 },
  { label: "$50 ~ $100", min: 50, max: 100 },
  { label: "$100 ~ $200", min: 100, max: 200 },
  { label: "$200 ~ $300", min: 200, max: 300 },
  { label: "$300 이상", min: 300, max: 500000 }
];

export default function ProductList() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ categoryId: "", brandId: "", minPrice: 0, maxPrice: 500000 });
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [customPrice, setCustomPrice] = useState(false);
  const [sortType, setSortType] = useState("LATEST");
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/search/products`, {
          params: {
            "keyword": keyword,
            "page": page,
            "sortType": sortType,
            "categoryId": filters.categoryId,
            "brandId": filters.brandId,
            "minPrice": filters.minPrice,
            "maxPrice": filters.maxPrice,
          },
        });
        if (page === 0) {
          setProducts(response.data['result']['content']);
        } else {
          setProducts((prev) => {
            const newProducts = [...prev, ...response.data['result']['content']];
            return Array.from(new Map(newProducts.map((p) => [p.product_id, p])).values());
          });
        }
        setIsLastPage(response.data['result']['last']);
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
    setPage(0); // 필터 변경 시 페이지 초기화
  };

  const handlePriceFilter = (index) => {
    if (index === selectedPrice) return;
    setSelectedPrice(index);
    setCustomPrice(false);
    setFilters({ ...filters, minPrice: priceRanges[index].min, maxPrice: priceRanges[index].max });
    setPage(0); // 가격 필터 변경 시 페이지 초기화
  };

  const applyCustomPrice = () => {
    setSelectedPrice(null);
    setCustomPrice(true);
    setPage(0); // 커스텀 가격 적용 시 페이지 초기화
  };

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
    setPage(0); // 정렬 변경 시 페이지 초기화
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