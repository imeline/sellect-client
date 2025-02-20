import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // 상품 정보 조회 API 호출
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/products/${productId}`);
        setProduct(response.data.result);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProductDetail();
  }, [productId]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // 대표 이미지 찾기
  const representativeImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.representative)?.image_url || product.images[0].image_url
      : "https://via.placeholder.com/400";

  // 상세 이미지 필터링 (대표 이미지 제외 + 'SL' 키워드 포함)
  const detailImages =
    product.images && product.images.length > 0
      ? product.images
        .filter((img) => !img.representative && img.image_url.includes("SL"))
        .map((img) => img.image_url)
      : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start">
            {/* 대표 이미지를 감싸는 고정된 세로 사이즈 컨테이너 */}
            <div className="w-full h-96">
              <img
                src={representativeImage}
                alt={product.name || "상품 이미지"}
                className="w-full h-full object-contain rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 mb-2">{product.name || "상품명"}</h1>

              {/* 카테고리, 브랜드명, 판매자명 */}
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p>
                  <span className="font-medium text-gray-800">카테고리:</span>{" "}
                  {product["category_name"] || "미지정"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">브랜드:</span>{" "}
                  {product["brand_name"] || "미지정"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">판매자:</span>{" "}
                  {product["seller_name"] || "미지정"}
                </p>
              </div>

              {/* 가격과 버튼을 같은 행에 배치 */}
              <div className="flex items-center mb-4 space-x-4">
                <p className="text-gray-500 text-xl">
                  ₩{product.price ? product.price.toLocaleString() : "0"}
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
                  장바구니에 추가
                </button>
              </div>

              {/* 평점 (주석 해제 시 사용 가능) */}
              {/* <div className="flex items-center mb-4">
                <div className="flex text-yellow-500 mr-2">
                  {"★".repeat(Math.floor(product.rating || 0))}
                  {"☆".repeat(5 - Math.floor(product.rating || 0))}
                </div>
                <span className="text-gray-600">{product.rating || "0.0"}</span>
              </div> */}
              <p className="text-gray-700 mb-8">{product.description || "상품 설명이 없습니다."}</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">상품 상세 정보</h2>
          <div className={`relative space-y-8 ${isExpanded ? "" : "max-h-96 overflow-hidden"}`}>
            {detailImages.length > 0 ? (
              detailImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`상품 상세 이미지 ${index + 1}`}
                  className="w-full h-auto rounded-md shadow-sm"
                />
              ))
            ) : (
              <p className="text-gray-500">상세 이미지가 없습니다.</p>
            )}
            {!isExpanded && detailImages.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={toggleExpansion}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-sm transition duration-150 ease-in-out"
            >
              {isExpanded ? "상품 정보 접기" : "상품 정보 더보기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}