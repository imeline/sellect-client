import { useState } from "react";

const allProducts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `상품 ${i + 1}`,
  price: (i + 1) * 5000,
  category: i % 2 === 0 ? "전자제품" : "의류",
  brand: i % 3 === 0 ? "브랜드 A" : "브랜드 B",
  image: "https://via.placeholder.com/150",
  description: "이 제품은 매우 품질이 뛰어나며 고객들에게 인기가 많습니다.",
  rating: (Math.random() * 5).toFixed(1)
}));

const ITEMS_PER_PAGE = 8;
const priceRanges = [
  { label: "전체", min: 0, max: 500000 },
  { label: "5만원 이하", min: 0, max: 50000 },
  { label: "5만원 ~ 10만원", min: 50000, max: 100000 },
  { label: "10만원 ~ 20만원", min: 100000, max: 200000 },
  { label: "20만원 ~ 30만원", min: 200000, max: 300000 },
  { label: "30만원 이상", min: 300000, max: 500000 }
];

// TODO: 검색 필터 및 정렬 조건 선택에 따라 api 요청 보내기
export default function ProductList() {
  const [cart, setCart] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [filters, setFilters] = useState({ category: "", brand: "", minPrice: 0, maxPrice: 500000 });
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [customPrice, setCustomPrice] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});
  const [sortType, setSortType] = useState("rating-desc");

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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

  const handleFileUpload = (e, productId) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImages((prev) => ({ ...prev, [productId]: URL.createObjectURL(file) }));
    }
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const sortedProducts = [...allProducts].sort((a, b) => {
    if (sortType === "price-asc") return a.price - b.price;
    if (sortType === "price-desc") return b.price - a.price;
    if (sortType === "rating-desc") return b.rating - a.rating;
    return 0;
  });

  const filteredProducts = allProducts.filter(
    (product) =>
      (!filters.category || product.category === filters.category) &&
      (!filters.brand || product.brand === filters.brand) &&
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice
  );

  return (
    <div className="min-h-screen flex flex-row bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8">
      {/* Sidebar for Filters */}
      <aside className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">필터</h2>
        <div className="mb-4">
          <label className="block text-gray-700">카테고리</label>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded">
            <option value="">전체</option>
            <option value="전자제품">전자제품</option>
            <option value="의류">의류</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">브랜드</label>
          <select name="brand" value={filters.brand} onChange={handleFilterChange} className="w-full p-2 border rounded">
            <option value="">전체</option>
            <option value="브랜드 A">브랜드 A</option>
            <option value="브랜드 B">브랜드 B</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">가격 범위</label>
          <div className="flex flex-col gap-2">
            {priceRanges.map((range, index) => (
              <div key={index} className="flex items-center gap-2">
                <button
                  onClick={() => handlePriceFilter(index)}
                  className={`w-5 h-5 rounded-full border-4 transition-colors ${
                    selectedPrice === index ? "border-indigo-600" : "border-gray-400"
                  }`}
                />
                <span className="text-gray-700">{range.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCustomPrice(true)}
            className="mt-4 w-full py-2 text-center bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            직접 입력
          </button>
          {customPrice && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                placeholder="최소 가격"
                className="w-1/2 p-2 border rounded"
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
              />
              <input
                type="number"
                placeholder="최대 가격"
                className="w-1/2 p-2 border rounded"
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              />
              <button onClick={applyCustomPrice} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                적용
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Product List */}
      <div className="w-3/4 pl-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">상품 리스트</h1>
          <select onChange={handleSortChange} value={sortType} className="p-2 border rounded">
            <option value="latest-desc">신상품순</option>
            <option value="price-asc">가격 낮은순</option>
            <option value="price-desc">가격 높은순</option>
            <option value="rating-desc">후기순</option>
          </select>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg text-center">
              <img
                src={uploadedImages[product.id] || product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="mt-2 text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-gray-500">₩{product.price.toLocaleString()}</p>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              <div className="flex justify-center mt-2 text-yellow-500">
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
              >
                장바구니 추가
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}