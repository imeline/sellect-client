import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get("keyword") || ""; // URL에서 초기 키워드 가져오기

  const [keyword, setKeyword] = useState(initialKeyword);

  // URL의 keyword가 변경될 때 검색어 상태 동기화
  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  // 검색 실행: 키워드만 전달 & 페이지 이동
  const handleSearch = () => {
    if (!keyword.trim()) return; // 빈 검색어 방지
    navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
  };

  // 엔터 키 입력 시 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 엔터 이벤트 방지
      handleSearch();
    }
  };

  return (
    <div className="hidden md:block flex-1 max-w-md mx-12">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
        />
      </div>
    </div>
  );
}