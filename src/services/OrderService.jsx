import axios from "axios";


const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchOrderDetail = async (orderId) => {
  if (!orderId) {
    throw new Error("주문 ID가 없습니다.");
  }

  try {
    const response = await axios.get(
        `${VITE_API_BASE_URL}/api/v1/orders/${orderId}/pending`,
        {
          withCredentials: true
        }
    );
    if (response.data.is_success) {
      return response.data.result;
    } else {
      throw new Error(
          response.data.message || "주문 정보를 불러오지 못했습니다."
      );
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw new Error(
        error.response?.data?.message || "네트워크 오류가 발생했습니다."
    );
  }
};

export const getAvailableCoupons = async (productIds) => {
  try {
    const response = await axios.post(
        `${VITE_API_BASE_URL}/api/v1/coupon/possible-order`,
        productIds, {
          withCredentials: true
        }
    );
    if (response.data.is_success) {
      return response.data.result;
    } else {
      throw new Error(
          response.data.message || "사용 가능한 쿠폰 조회에 실패했습니다."
      );
    }
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw new Error(
        error.response?.data?.message || "네트워크 오류가 발생했습니다."
    );
  }
};

export const preparePayment = async (paymentData) => {
  try {
    const response = await axios.post(
        `${VITE_API_BASE_URL}/api/v1/payment/ready`,
        paymentData, {
          withCredentials: true
        }
    );
    if (response.data.is_success) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "결제 준비에 실패했습니다.");
    }
  } catch (error) {
    console.error("Error preparing payment:", error);
    throw new Error(
        error.response?.data?.message || "네트워크 오류가 발생했습니다."
    );
  }
};
