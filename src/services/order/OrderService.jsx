import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/orders";

export const fetchOrderDetail = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${orderId}`);
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
