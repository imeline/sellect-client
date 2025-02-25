import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SellerHome() {
  const [sellerStats, setSellerStats] = useState({
    totalProductsCount: 0,
    totalSales: "0원",
    pendingOrders: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let response = await axios.get(`${VITE_API_BASE_URL}/api/v1/seller/stats`, {
          withCredentials: true,
        });
        setSellerStats((prev) => ({
          ...prev,
          totalSales: response.data.result.total_sales.toLocaleString() + "원",
          totalProductsCount: response.data.result.total_products_count || 0,
        }));

        // response = await axios.get(`${VITE_API_BASE_URL}/api/v1/seller/products/recent`, {
        //   withCredentials: true,
        // });
        // setRecentProducts(response.data.result || []);
      } catch (error) {
        console.error("상품 정보를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchStats()
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to <span className="text-indigo-600">SELLECT Seller</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              상품을 관리하고 매출을 극대화하세요.
            </p>
            <div className="mt-5 mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
              <div className="rounded-md shadow">
                <Link
                  to="/seller/products/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  새 상품 등록
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 rounded-md shadow">
                <Link
                  to="/coupon/upload"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                >
                  쿠폰 등록하기
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 rounded-md shadow">
                <Link
                  to="/seller/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                >
                  대시보드
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">판매 요약</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900">등록된 상품</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{sellerStats.totalProductsCount}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900">총 매출</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{sellerStats.totalSales}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900">대기 중인 주문</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{sellerStats.pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">최근 등록 상품</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div
                className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link to={`/seller/products/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0"/>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">재고: {product.stock}</p>
                </div>
                <Link
                  to={`/seller/products/${product.id}/edit`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  수정
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerHome;