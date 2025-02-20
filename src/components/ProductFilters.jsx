import { priceRanges } from "../pages/constants";

export default function ProductFilters({ filters, selectedPrice, customPrice, onFilterChange, onPriceFilter, onCustomPriceApply }) {
  const handleFilterChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <aside className="w-1/4 p-4 bg-white shadow-lg rounded-lg sticky top-24 self-start">
      <h2 className="text-xl font-bold mb-4">필터</h2>
      <div className="mb-4">
        <label className="block text-gray-700">카테고리</label>
        <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded">
          <option value="">전체</option>
          <option value="전자제품">전자제품</option>
          <option value="의류">의류</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">브랜드</label>
        <select name="brand" value={filters.brand} onChange={handleFilterChange} className="w-full p-2 border rounded">
          <option value="">전체</option>
          <option value="브랜드 A">브랜드 A</option>
          <option value="브랜드 B">브랜드 B</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">가격 범위</label>
        <div className="flex flex-col gap-2">
          {priceRanges.map((range, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                onClick={() => onPriceFilter(index)}
                className={`w-5 h-5 rounded-full border-4 transition-colors ${
                  selectedPrice === index ? "border-indigo-600" : "border-gray-400"
                }`}
              />
              <span className="text-gray-700">{range.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => onCustomPriceApply()}
          className="mt-4 w-full py-2 text-center bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          직접 입력
        </button>
        {customPrice && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              placeholder="최소 가격"
              className="w-1/2 p-2 border rounded"
              onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="최대 가격"
              className="w-1/2 p-2 border rounded"
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            />
          </div>
        )}
      </div>
    </aside>
  );
}