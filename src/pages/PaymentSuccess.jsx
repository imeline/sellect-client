import React, { useEffect } from 'react';

function PaymentSuccess() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage('PAYMENT_SUCCESS', '*');
      window.close();
    }
  }, []);

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">결제가 완료되었습니다</h1>
          <p className="text-gray-600">잠시만 기다려주세요...</p>
        </div>
      </div>
  );
}

export default PaymentSuccess;