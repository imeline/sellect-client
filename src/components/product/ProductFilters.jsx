import {useState, useEffect} from "react";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const priceRanges = [
  { label: "전체", min: 0, max: 500000000 },
  { label: "50,000원 이하", min: 0, max: 50000 },
  { label: "50,000원 ~ 100,000원", min: 50000, max: 100000 },
  { label: "100,000원 ~ 200,000원", min: 100000, max: 200000 },
  { label: "200,000원 ~ 300,000원", min: 200000, max: 300000 },
  { label: "300,000원 이상", min: 300000, max: 500000 }
];

export default function ProductFilters({
                                         filters,
                                         selectedPrice,
                                         customPrice,
                                         onFilterChange,
                                         onPriceFilter,
                                         onCustomPriceApply,
                                       }) {
  // 카테고리 데이터를 저장할 상태
  const [categories, setCategories] = useState([]);
  const [largeCategory, setLargeCategory] = useState(filters.largeCategory || "");
  const [mediumCategory, setMediumCategory] = useState(filters.mediumCategory || "");
  const [smallCategory, setSmallCategory] = useState(filters.smallCategory || "");

  // API 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let response = await axios.get(`${VITE_API_BASE_URL}/api/v1/categories`);
        setCategories(response.data.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (e) => {
    const {name, value} = e.target;

    // 카테고리 변경 시 상태 업데이트 및 상위 컴포넌트로 전달
    if (name === "largeCategory") {
      setLargeCategory(value);
      setMediumCategory(""); // 대분류 변경 시 중분류 초기화
      setSmallCategory(""); // 소분류 초기화
    } else if (name === "mediumCategory") {
      setMediumCategory(value);
      setSmallCategory(""); // 중분류 변경 시 소분류 초기화
    } else if (name === "smallCategory") {
      setSmallCategory(value);
      onFilterChange({
        ...filters,
        categoryId: value,
      });
    }
  };

  return (
    <aside className="w-1/4 p-4 bg-white shadow-lg rounded-lg sticky top-24 self-start">
      <h2 className="text-xl font-bold mb-4">필터</h2>

      {/* 대분류 선택 */}
      <div className="mb-4">
        <label className="block text-gray-700">대분류</label>
        <select
          name="largeCategory"
          value={largeCategory}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">전체</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 중분류 선택 */}
      <div className="mb-4">
        <label className="block text-gray-700">중분류</label>
        <select
          name="mediumCategory"
          value={mediumCategory}
          onChange={handleFilterChange}
          disabled={!largeCategory}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        >
          <option value="">전체</option>
          {largeCategory &&
            categories
              .find((cat) => cat.id === Number(largeCategory))
              ?.children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
        </select>
      </div>

      {/* 소분류 선택 */}
      <div className="mb-4">
        <label className="block text-gray-700">소분류</label>
        <select
          name="smallCategory"
          value={smallCategory}
          onChange={handleFilterChange}
          disabled={!mediumCategory}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        >
          <option value="">전체</option>
          {mediumCategory &&
            categories
              .find((cat) => cat.id === Number(largeCategory))
              ?.children.find((child) => child.id === Number(mediumCategory))
              ?.children.map((subChild) => (
              <option key={subChild.id} value={subChild.id}>
                {subChild.name}
              </option>
            ))}
        </select>
      </div>

      {/* 브랜드 선택 */}
      <div className="mb-4">
        <label className="block text-gray-700">브랜드</label>
        <select
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">전체</option>
          <option value="브랜드 A">브랜드 A</option>
          <option value="브랜드 B">브랜드 B</option>
        </select>
      </div>

      {/* 가격 범위 */}
      <div className="mb-4">
        <label className="block text-gray-700">가격 범위</label>
        <div className="flex flex-col gap-2">
          {priceRanges.map((range, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                onClick={() => onPriceFilter(index)}
                className={`w-5 h-5 rounded-full border-4 transition-colors ${
                  selectedPrice === index ? "border-indigo-600" : "border-gray-400"
                }`}
              />
              <span className="text-gray-700">{range.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => onCustomPriceApply()}
          className="mt-4 w-full py-2 text-center bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 ease-in-out"
        >
          직접 입력
        </button>
        {customPrice && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              placeholder="최소 가격"
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => onFilterChange({...filters, minPrice: Number(e.target.value)})}
            />
            <input
              type="number"
              placeholder="최대 가격"
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => onFilterChange({...filters, maxPrice: Number(e.target.value)})}
            />
          </div>
        )}
      </div>
    </aside>
  );
}