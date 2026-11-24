import { ContentSlide, BulletList, Badge } from "@/components";

export default function Example() {
  return (
    <ContentSlide
      label="핵심 내용"
      eyebrow="method"
      title="핵심 내용"
      aside={<Badge status="pass">검증 완료</Badge>}
      notes="발표자 노트는 N 키로 연다."
    >
      <BulletList
        items={[
          "첫 번째 요점을 한 문장으로 적습니다.",
          { text: "두 번째 요점을 한 문장으로 적습니다.", sub: "sub 로 보충 설명을 붙인다." },
        ]}
      />
    </ContentSlide>
  );
}
