import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ apiBaseUrl }) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = async () => {
    if (!keyword.trim()) {
      console.warn("검색어가 비어 있습니다.");
      return;
    }
    if (!apiBaseUrl) {
      console.error("API_BASE_URL이 설정되지 않았습니다.");
      return;
    }

    try {
      const response = await fetch(
          `${apiBaseUrl}/api/v1/search/products?keyword=${encodeURIComponent(keyword)}`
      );
      if (!response.ok) {
        throw new Error(`검색 요청 실패: ${response.status}`);
      }
      const data = await response.json();
      console.log("검색 결과:", data);
    } catch (error) {
      console.error("검색 요청 중 오류 발생:", error);
    }
  };

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
              onKeyDown={handleKeyDown} // 엔터 키 이벤트 핸들러 추가
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </div>
  );
}
