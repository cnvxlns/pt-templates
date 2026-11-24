import { SlideHeader, Badge } from "@/components";

export default function Example() {
  return (
    <SlideHeader
      eyebrow="results"
      title="본문 슬라이드 헤더"
      aside={<Badge status="warn">진행 중</Badge>}
    />
  );
}
