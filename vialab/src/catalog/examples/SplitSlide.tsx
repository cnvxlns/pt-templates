import { SplitSlide, Lead, Placeholder } from "@/components";

export default function Example() {
  return (
    <SplitSlide
      label="제안 방법"
      title="제안 방법"
      aside={<Placeholder label="system diagram" height={720} />}
    >
      <Lead>구조나 파이프라인을 두세 문장으로 설명합니다. 세부 수식은 부록으로 옮깁니다.</Lead>
    </SplitSlide>
  );
}
