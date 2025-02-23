import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

export const fetchOrderDetail = async (orderId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/${orderId}/pending`
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
      `${API_BASE_URL}/coupon/possible-order`,
      productIds
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
      `${API_BASE_URL}/payment/ready`,
      paymentData
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
