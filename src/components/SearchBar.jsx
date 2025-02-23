import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // URL 키워드 동기화
  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 검색어 입력 시 제안 목록 가져오기 (API 호출)
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/search/auto-complete`, {
        params: { query: value },
      });
      const filtered = response.data.result.keywords || [];
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("제안 목록을 불러오는데 실패했습니다.");
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        setKeyword(suggestions[highlightedIndex]);
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
      handleSearch();
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // 검색 실행
  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
    setIsOpen(false);
  };

  // 제안 항목 클릭
  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    handleSearch();
  };

  return (
    <div className="hidden md:block flex-1 max-w-md mx-12">
      <div className="relative" ref={dropdownRef}>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm text-gray-900 shadow-sm transition duration-150 ease-in-out"
          />
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-sm text-gray-500">
            검색 제안을 불러오는 중...
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 자동완성 드롭다운 */}
        {isOpen && !isLoading && !error && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition duration-150 ease-in-out ${
                  index === highlightedIndex ? "bg-indigo-50 text-indigo-600" : ""
                }`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}