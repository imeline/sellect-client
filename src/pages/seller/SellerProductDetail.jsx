import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SellerProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/seller/products/${productId}`, {
          withCredentials: true,
        });
        setProductDetail(response.data.result || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product detail:", err);
        setError("상품 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [productId]);

  const handleEdit = () => {
    navigate(`/seller/products/${productId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${VITE_API_BASE_URL}/api/v1/seller/products/${productId}`, {
          withCredentials: true,
        });
        alert("상품이 삭제되었습니다.");
        navigate("/seller/dashboard");
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("상품 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">상품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !productDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error || "상품을 찾을 수 없습니다."}</p>
      </div>
    );
  }

  const representativeImage =
    productDetail.images && productDetail.images.length > 0
      ? productDetail.images.find((img) => img.representative)?.image_url || productDetail.images[0].image_url
      : "https://via.placeholder.com/400";

  const detailImages =
    productDetail.images && productDetail.images.length > 0
      ? productDetail.images.filter((img) => !img.representative).map((img) => img.image_url)
      : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mt-8 mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            상품 상세 <span className="text-indigo-600">관리</span>
          </h1>
          <p className="mt-2 text-lg text-gray-500">판매 중인 상품 정보를 확인하고 관리하세요.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Product Info with Representative Image */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between border border-gray-100">
            <div>
              {/* Representative Image */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">대표 이미지</p>
                <img
                  src={representativeImage}
                  alt="대표 이미지"
                  className="w-full h-64 object-contain rounded-md shadow-md transition-transform hover:scale-105"
                />
              </div>

              <h2 className="text-xl font-extrabold text-gray-900 mb-4">{productDetail.name || "상품명"}</h2>
              <div className="text-sm text-gray-600 mb-6 space-y-2">
                <p>
                  <span className="font-medium text-gray-800">상품 ID:</span> {productDetail.product_id || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">카테고리:</span>{" "}
                  {productDetail.category_name || "미지정"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">브랜드:</span>{" "}
                  {productDetail.brand_name || "미지정"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">가격:</span> $
                  {productDetail.price ? productDetail.price.toLocaleString() : "0"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">재고:</span> {productDetail.stock || 0}
                </p>
                <p>
                  <span className="font-medium text-gray-800">등록 날짜:</span>{" "}
                  {productDetail.created_at ? new Date(productDetail.created_at).toLocaleDateString() : "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">총 주문 수:</span>{" "}
                  {productDetail.total_orders || 0}
                </p>
                <p>
                  <span className="font-medium text-gray-800">판매 금액:</span> $
                  {productDetail.total_sales ? productDetail.total_sales.toLocaleString() : "0"}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">상품 설명</h3>
                <p className="text-gray-700 leading-relaxed">{productDetail.description || "상품 설명이 없습니다."}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out text-sm font-medium"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-150 ease-in-out text-sm font-medium"
              >
                삭제
              </button>
            </div>
          </div>

          {/* Right: Detail Images */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">상품 상세 이미지</h3>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-2">
              {detailImages.length > 0 ? (
                detailImages.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`상세 이미지`}
                    className="w-full object-contain rounded-md shadow-md transition-transform hover:scale-105"
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">상세 이미지가 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            to="/seller/dashboard"
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}