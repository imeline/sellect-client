// TODO: 임시 변수 삭제

export const allProducts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `상품 ${i + 1}`,
  price: (i + 1) * 5000,
  category: i % 2 === 0 ? "전자제품" : "의류",
  brand: i % 3 === 0 ? "브랜드 A" : "브랜드 B",
  image: "https://image.msscdn.net/thumbnails/images/goods_img/20220907/2778651/2778651_16956212604528_big.jpg?w=1200",
  description: "이 제품은 매우 품질이 뛰어나며 고객들에게 인기가 많습니다.",
  rating: (Math.random() * 5).toFixed(1)
}));

export const priceRanges = [
  { label: "전체", min: 0, max: 500000 },
  { label: "5만원 이하", min: 0, max: 50000 },
  { label: "5만원 ~ 10만원", min: 50000, max: 100000 },
  { label: "10만원 ~ 20만원", min: 100000, max: 200000 },
  { label: "20만원 ~ 30만원", min: 200000, max: 300000 },
  { label: "30만원 이상", min: 300000, max: 500000 }
];