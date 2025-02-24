import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <h1 className="text-6xl font-extrabold text-gray-900 sm:text-7xl">
          <span className="text-indigo-600">401</span>
        </h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">접근 권한이 없습니다</p>
        <p className="mt-2 text-lg text-gray-500">
          이 페이지에 접근할 권한이 없어요. 로그인 상태를 확인하거나 홈으로 돌아가세요!
        </p>

        {/* Illustration (Lock Icon) */}
        <div className="mt-8">
          <svg
            className="mx-auto h-32 w-32 text-indigo-600 opacity-75"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 11V8a3 3 0 00-6 0v3m-3 0h12a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
            />
          </svg>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 shadow-md transition duration-150 ease-in-out"
          >
            로그인
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition duration-150 ease-in-out"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}