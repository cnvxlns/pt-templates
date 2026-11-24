import { BulletList } from "@/components";

export default function Example() {
  return (
    <BulletList
      items={[
        "한 줄짜리 요점",
        { text: "보충 설명이 있는 요점", sub: "sub 를 주면 회색 한 줄이 붙는다." },
        "템플릿 권장: 세 개 이내",
      ]}
    />
  );
}
