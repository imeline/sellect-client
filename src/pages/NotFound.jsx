import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <h1 className="text-6xl font-extrabold text-gray-900 sm:text-7xl">
          <span className="text-indigo-600">404</span>
        </h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">페이지를 찾을 수 없습니다</p>
        <p className="mt-2 text-lg text-gray-500">
          요청하신 페이지를 찾을 수 없어요. 경로를 확인하거나 홈으로 돌아가세요!
        </p>

        {/* Illustration (Optional) */}
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
              d="M9.172 16.172a4 4 0 015.656 0M12 12v4m0-8v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Button */}
        <div className="mt-8">
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