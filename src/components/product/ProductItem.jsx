import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";
import {ShoppingCartIcon} from "@heroicons/react/24/solid";
import {useAuth} from "../../context/AuthContext.jsx";

export default function ProductItem({ product }) {
  const navigate = useNavigate();
  const [showCartMessage, setShowCartMessage] = useState(false);
  const { updateCartCount } = useAuth();

  const addToCart = async () => {
    const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.put(
        `${baseApiUrl}/api/v1/cart`,
        {
          product_id: product.product_id,
        },
        {
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        setShowCartMessage(true);
        setTimeout(() => {
          setShowCartMessage(false);
        }, 2000);
        updateCartCount();
      }
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 추가에 실패했습니다.");
    }
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
      className="bg-white p-4 rounded-lg shadow-lg text-center cursor-pointer relative"
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
      <p className="text-gray-500">{product.price.toLocaleString()}원</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart();
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center justify-center gap-1 text-sm"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            장바구니 담기
          </button>
          {showCartMessage && (
            <div className="absolute bottom-full mb-2 right-0 w-64">
              <div className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  장바구니에 추가되었습니다
                </div>
              </div>
              <div className="w-3 h-3 bg-indigo-600 transform rotate-45 absolute right-4 -bottom-1 shadow-lg"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}