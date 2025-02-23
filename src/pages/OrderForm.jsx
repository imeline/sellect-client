import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartOrderItem from "../components/CartOrderItem";
import PaymentSummary from "../components/order/PaymentSummary";
import axios from "axios";
import {useAuth} from "../context/AuthContext.jsx";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OrderForm() {
  const [orderItems, setOrderItems] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const {updateCartCount} = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  // 결제 성공 메시지 리스너
  useEffect(() => {
    const handlePaymentMessage = async (event) => {
      if (event.data === 'PAYMENT_SUCCESS') {
        const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/carts/count`, {
          withCredentials: true,
        });
        updateCartCount(response.data.result);
        navigate('/order/complete', {
          state: {
            orderId: orderId,
            totalAmount: finalPrice
          }
        });
      }
    };

    window.addEventListener('message', handlePaymentMessage);
    return () => window.removeEventListener('message', handlePaymentMessage);
  }, [navigate, orderId]);

  // 주문 상품 가져오기
  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!orderId) {
        alert("유효한 주문 ID가 없습니다.");
        navigate("/cart");
        return;
      }

      try {
        const response = await fetch(`${VITE_API_BASE_URL}/api/v1/orders/${orderId}/pending`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('주문 상품을 불러오지 못했습니다.');
        }

        const data = await response.json();
        setOrderItems(data?.result || []);
      } catch (err) {
        setError(err.message);
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderId, navigate]);

  // 쿠폰 가져오기
  const fetchCoupons = async () => {
    setCouponLoading(true);
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/coupons?page=0&size=5&isUsed=false`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('쿠폰을 불러오지 못했습니다.');
      }

      const data = await response.json();
      setCoupons(data?.result || []);
      setShowCoupons(true);
    } catch (err) {
      setCouponError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const totalPrice = Array.isArray(orderItems)
      ? orderItems.reduce((acc, item) => acc + (parseFloat(item.product_price) * item.quantity), 0)
      : 0;
  const discount = coupon ? coupon.discount : 0;
  const finalPrice = totalPrice - discount;

  // 쿠폰 적용
  const applyCoupon = (selectedCoupon) => {
    setCoupon(selectedCoupon);
    setShowCoupons(false);
  };

  // 결제 처리
  const handlePayment = async () => {
    if (!orderItems.length) {
      alert("주문 상품이 없습니다.");
      return;
    }

    const paymentData = {
      order_id: orderId,
      item_name: orderItems.length > 1
          ? `${orderItems[0].product_name} 외 ${orderItems.length - 1}건`
          : orderItems[0].product_name,
      quantity: orderItems.reduce((acc, item) => acc + item.quantity, 0),
      total_amount: finalPrice,
    };

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/payment/ready`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('결제 준비에 실패했습니다.');
      }

      const data = await response.json();
      const redirectUrl = data.result;
      const newWindow = window.open(redirectUrl, '_blank', 'width=500,height=700');

      if (!newWindow) {
        alert('결제 창이 차단되었습니다. 브라우저 설정에서 팝업을 허용해 주세요.');
      }
    } catch (err) {
      console.error('결제 준비 실패:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center text-gray-500 text-lg animate-pulse">로딩 중...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center text-red-600 text-lg">{error}</div>
    </div>;
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100/50 via-white/50 to-purple-100/50 pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-10">주문서</h1>

          {/* 주문 상품 목록 */}
          <div className="space-y-6">
            {orderItems.map((item) => (
                <CartOrderItem
                    key={item.product_id}
                    item={{
                      id: item.product_id,
                      brand: item.brand_name,
                      product_name: item.product_name,
                      product_price: parseFloat(item.product_price),
                      quantity: item.quantity,
                      imageUrl: item.image_url,
                    }}
                />
            ))}
          </div>

          {/* 쿠폰 버튼 */}
          <div className="mt-6 flex justify-end">
            <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-full"
                onClick={fetchCoupons}
                disabled={couponLoading}
            >
              {couponLoading ? '로딩 중...' : '쿠폰 사용'}
            </button>
          </div>

          {/* 쿠폰 모달 */}
          {showCoupons && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">사용 가능한 쿠폰</h3>
                  {coupons.map((couponItem) => (
                      <div key={couponItem.id} className="border-b p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{couponItem.name}</p>
                            <p className="text-sm text-gray-600">할인: {couponItem.discount}원</p>
                          </div>
                          <button
                              className="px-3 py-1 bg-indigo-600 text-white rounded-full"
                              onClick={() => applyCoupon(couponItem)}
                          >
                            적용
                          </button>
                        </div>
                      </div>
                  ))}
                  <button
                      className="mt-4 w-full py-2 bg-gray-200 rounded-full"
                      onClick={() => setShowCoupons(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
          )}

          {/* 결제 요약 */}
          <PaymentSummary
              totalPrice={totalPrice}
              discount={discount}
              finalPrice={finalPrice}
          />

          {/* 결제 버튼 */}
          <button
              className="w-full mt-8 py-3 bg-indigo-600 text-white rounded-full"
              onClick={handlePayment}
          >
            결제하기
          </button>
        </div>
      </div>
  );
}

export default OrderForm;