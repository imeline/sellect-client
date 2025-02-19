import { useParams } from "react-router-dom";
import { allProducts } from "./constants";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === parseInt(id));
  const [isExpanded, setIsExpanded] = useState(false);

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  // 가짜 이미지 URL 배열
  const detailImages = [
    "https://image.musinsa.com/images/prd_img/2023092514544900000048515.jpg",
    "https://image.musinsa.com/images/prd_img/2023092514544800000035064.jpg",
    "https://image.musinsa.com/images/prd_img/2023092514545100000035410.jpg",
    "https://image.musinsa.com/images/prd_img/2023092514545100000028538.jpg",
    "https://image.musinsa.com/images/prd_img/2023092514544900000062603.jpg",
    "https://image.musinsa.com/images/prd_img/2023092514545000000071635.jpg",
    "https://image.musinsa.com/images/prd_img/2023092514544900000088666.jpg",
    "https://image.musinsa.com/images/prd_img/2023112717591600000003946.jpg",
    "https://image.musinsa.com/images/prd_img/2023112717591600000017287.jpg",
    "https://image.musinsa.com/images/prd_img/2023092514544800000004671.jpg"
  ];

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-md" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-500 text-xl mb-4">₩{product.price.toLocaleString()}</p>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500 mr-2">
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-gray-600">{product.rating}</span>
            </div>
            <p className="text-gray-700 mb-8">{product.description}</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
              장바구니에 추가
            </button>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">상품 상세 정보</h2>
          <div className={`relative space-y-8 ${isExpanded ? "" : "max-h-96 overflow-hidden"}`}>
            {detailImages.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`상품 상세 이미지 ${index + 1}`} className="w-full h-auto" />
            ))}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={toggleExpansion}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md text-lg font-semibold"
            >
              {isExpanded ? "상품 정보 접기" : "상품 정보 더보기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}