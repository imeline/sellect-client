import {useNavigate} from "react-router-dom";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductItem({product}) {
  const navigate = useNavigate();

// 장바구니 추가 함수 (API 연동 포함)
  const addToCart = async () => {
    // .env.local에서 VITE_BASE_API_URL 가져오기
    const baseApiUrl = import.meta.env.VITE_API_BASE_URL; // 예: "http://localhost:8080"
    // --- 장바구니 추가 로직 구현 시작 ---
    try {
      const response = await axios.put(`${VITE_API_BASE_URL}/api/v1/cart`, {
        product_id: product.product_id,
      }, {
        withCredentials: true,
      });

      // 요청 성공 시 사용자에게 알림
      if (response.status === 200) {
        alert("장바구니에 추가되었습니다!");
      }
    } catch (error) {
      // 에러 발생 시 콘솔에 기록하고 사용자에게 알림
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 추가에 실패했습니다.");
    }
    // --- 장바구니 추가 로직 구현 끝 ---
  };

  const goToProductDetail = () => {
    navigate(`${product.product_id}`);
  };

  const truncateProductName = (name, maxLength) => {
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + "...";
    }
    return name;
  };

  return (
      <div
          className="bg-white p-4 rounded-lg shadow-lg text-center cursor-pointer"
          onClick={goToProductDetail}
      >
        <div className="relative w-full aspect-square">
          <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain rounded-md"
          />
        </div>
        <h2 className="mt-2 text-lg font-semibold text-gray-900 truncate">
          {truncateProductName(product.name, 20)}
        </h2>
        <p className="text-gray-500">${product.price.toLocaleString()}</p>
        <div className="flex justify-center mt-2 text-yellow-500">
          {"★".repeat(Math.floor(product.rating || 0))}
          {"☆".repeat(5 - Math.floor(product.rating || 0))}
        </div>
        <button
            onClick={(e) => {
              e.stopPropagation(); // 상위 div의 클릭 이벤트(상세 페이지 이동) 방지
              addToCart(); // 장바구니 추가 함수 호출
            }}
            className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
        >
          장바구니 추가
        </button>
      </div>
  );
}