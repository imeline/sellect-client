function PaymentSummary({ totalPrice, discount, finalPrice }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900">결제 금액 정보</h3>
      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm text-gray-700">
          <span>상품 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>쿠폰 할인</span>
          <span className="text-red-500">-{discount.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-md font-bold mt-2">
          <span>총 결제 금액</span>
          <span>{finalPrice.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}

export default PaymentSummary;
