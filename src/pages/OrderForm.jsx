import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import CartOrderItem from "../components/order/OrderItem.jsx";
import CouponItem from "../components/CouponItem";
import PaymentSummary from "../components/order/PaymentSummary";

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

  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  // 결제 성공 메시지 리스너
  useEffect(() => {
    const handlePaymentMessage = (event) => {
      if (event.data === "PAYMENT_SUCCESS") {
        navigate("/order/complete", {
          state: {
            orderId: orderId,
            totalAmount: finalPrice,
          },
        });
      }
    };

    window.addEventListener("message", handlePaymentMessage);
    return () => window.removeEventListener("message", handlePaymentMessage);
  }, [navigate, orderId]);

  // 주문 상품 가져오기
  useEffect(() => {
    if (!orderId) {
      alert("유효한 주문 ID가 없습니다.");
      navigate("/cart");
      return;
    }

    const fetchOrderItems = async () => {
      try {
        const response = await fetch(
            `${VITE_API_BASE_URL}/api/v1/orders/${orderId}/pending`,
            {credentials: "include"}
        );

        if (!response.ok) {
          throw new Error("주문 상품을 불러오지 못했습니다.");
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
    if (orderItems.length === 0) {
      setCouponError("주문 상품이 준비되지 않았습니다.");
      return;
    }

    setCouponLoading(true);
    try {
      const productIds = orderItems.map((item) => item.product_id);
      const params = new URLSearchParams();
      productIds.forEach((id) => params.append("productIds", id));
      const url = `${VITE_API_BASE_URL}/api/v1/coupon/possible-order?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("쿠폰을 불러오지 못했습니다.");
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

  // 총 금액 계산
  const totalPrice = orderItems.reduce(
      (acc, item) => acc + parseFloat(item.product_price) * item.quantity,
      0
  );
  const discount = coupon ? coupon.discount_cost : 0;
  const finalPrice = totalPrice - discount;

  // 쿠폰 적용
  const applyCoupon = (selectedCoupon) => {
    setCoupon(selectedCoupon);
    setShowCoupons(false);
  };

  // 결제 처리 (팝업 방식)
  const handlePayment = async () => {
    if (!orderItems.length) {
      alert("주문 상품이 없습니다.");
      return;
    }

    const paymentData = {
      order_id: orderId,
      item_name:
          orderItems.length > 1
              ? `${orderItems[0].product_name} 외 ${orderItems.length - 1}건`
              : orderItems[0].product_name,
      quantity: orderItems.reduce((acc, item) => acc + item.quantity, 0),
      total_amount: finalPrice,
    };

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/payment/ready`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          });

      if (!response.ok) {
        throw new Error("결제 준비에 실패했습니다.");
      }

      const data = await response.json();
      const redirectUrl = data.result; // body에서 redirectUrl 사용

      const paymentWindow = window.open(
          redirectUrl,
          "paymentPopup",
          "width=500,height=700,scrollbars=yes"
      );
      if (!paymentWindow) {
        alert("팝업 차단을 해제해주세요.");
      }
    } catch (err) {
      console.error("결제 준비 실패:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
        <div
            className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center text-gray-500 text-lg animate-pulse">로딩
            중...
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div
            className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center text-red-600 text-lg">{error}</div>
        </div>
    );
  }

  return (
      <div className="pt-12 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">주문서</h1>
          <div
              className="bg-white p-6 rounded-lg shadow-md border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">주문 상품</h3>
            <div className="flex flex-col gap-4">
              {orderItems.map((item) => (
                  <CartOrderItem key={item.product_id} item={item}/>
              ))}
            </div>

            {/* 쿠폰 버튼 */}
            <div className="mt-6 flex justify-end">
              <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full"
                  onClick={fetchCoupons}
                  disabled={couponLoading}
              >
                {couponLoading ? "로딩 중..." : "쿠폰 사용"}
              </button>
            </div>

            {/* 쿠폰 모달 */}
            {showCoupons && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4">사용 가능한 쿠폰</h3>
                    {couponError ? (
                        <div className="text-red-600">{couponError}</div>
                    ) : coupons.length === 0 ? (
                        <div className="text-gray-500">사용 가능한 쿠폰이 없습니다.</div>
                    ) : (
                        coupons.map((couponItem) => (
                            <CouponItem
                                key={couponItem.user_received_coupon_id}
                                coupon={couponItem}
                                applyCoupon={applyCoupon}
                            />
                        ))
                    )}
                    <button
                        className="mt-4 w-full py-2 bg-gray-200 rounded-full"
                        onClick={() => setShowCoupons(false)}
                    >
                      닫기
                    </button>
                  </div>
                </div>
            )}

            {/* 결제 요약 및 버튼 */}
            <PaymentSummary totalPrice={totalPrice} discount={discount}
                            finalPrice={finalPrice}/>
            <div className="mt-6 flex justify-end">
              <button
                  className="px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
                  onClick={handlePayment}
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default OrderForm;