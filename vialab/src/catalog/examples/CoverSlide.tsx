import { CoverSlide } from "@/components";

export default function Example() {
  return (
    <CoverSlide
      label="표지"
      title="발표 제목을 입력합니다"
      subtitle="부제 또는 한 줄 요약"
      presenter="홍길동 · 박사과정"
      date="2026.09.18"
    />
  );
}
