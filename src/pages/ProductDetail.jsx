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
    "https://image.musinsa.com/images/prd_img/2023092514544800000004671.jpg",
  ];

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* 대표 이미지 (images 배열에서 representative = true인 이미지 찾기) */}
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images.find((img) => img.representative)?.imageUrl || product.images[0].imageUrl
                  : detailImages[0]
              }
              alt={product.name || "상품 이미지"}
              className="w-full h-auto object-cover rounded-md shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name || "상품명"}</h1>

            {/* 카테고리, 브랜드명, 판매자명 추가 */}
            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <p>
                <span className="font-medium text-gray-800">카테고리:</span>{" "}
                {product['category_name'] || "미지정"}
              </p>
              <p>
                <span className="font-medium text-gray-800">브랜드:</span>{" "}
                {product['brand_name'] || "미지정"}
              </p>
              <p>
                <span className="font-medium text-gray-800">판매자:</span>{" "}
                {product['seller_name'] || "미지정"}
              </p>
            </div>

            <p className="text-gray-500 text-xl mb-4">
              ₩{product.price ? product.price.toLocaleString() : "0"}
            </p>
            {/*<div className="flex items-center mb-4">*/}
            {/*  <div className="flex text-yellow-500 mr-2">*/}
            {/*    {"★".repeat(Math.floor(product.rating || 0))}*/}
            {/*    {"☆".repeat(5 - Math.floor(product.rating || 0))}*/}
            {/*  </div>*/}
            {/*  <span className="text-gray-600">{product.rating || "0.0"}</span>*/}
            {/*</div>*/}
            <p className="text-gray-700 mb-8">{product.description || "상품 설명이 없습니다."}</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
              장바구니에 추가
            </button>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">상품 상세 정보</h2>
          <div className={`relative space-y-8 ${isExpanded ? "" : "max-h-96 overflow-hidden"}`}>
            {detailImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`상품 상세 이미지 ${index + 1}`}
                className="w-full h-auto rounded-md shadow-sm"
              />
            ))}
            {!isExpanded && (
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