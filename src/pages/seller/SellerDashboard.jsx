import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false); // 초기값 false로 수정

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/seller/products`, {
          params: {
            page: page,
            size: 20,
          },
          withCredentials: true,
        });
        setProducts(response.data.result.content || []);
        setIsLastPage(response.data.result.last || false); // 응답에 last가 없으면 false
        setLoading(false);
      } catch (err) {
        console.error("Error fetching seller products:", err);
        setError("상품 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };
    fetchSellerProducts();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
      setLoading(true); // 페이지 이동 시 로딩 상태로 전환
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setPage(page + 1);
      setLoading(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            판매자 <span className="text-indigo-600">대시보드</span>
          </h1>
          <p className="mt-2 text-lg text-gray-500">등록된 상품을 한눈에 확인하세요.</p>
        </div>

        {/* Products Section */}
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">등록 상품 목록</h2>
            <Link
              to="/seller/products/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              새 상품 등록
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">상품 목록을 불러오는 중입니다...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500">등록된 상품이 없습니다.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.product_id}
                    className="bg-white shadow rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                  >
                    <div className="w-full h-48 bg-gray-200">
                      <img
                        src={product.images[0]['image_url'] || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        가격: ${product.price?.toLocaleString() || "0"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">재고: {product.stock || 0}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <Link
                          to={`/seller/products/${product.product_id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          상세 보기
                        </Link>
                        <Link
                          to={`/seller/products/${product.product_id}/edit`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          수정
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    page === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  이전
                </button>
                <span className="text-gray-700">페이지 {page + 1}</span>
                <button
                  onClick={handleNextPage}
                  disabled={isLastPage}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isLastPage
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  다음
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}