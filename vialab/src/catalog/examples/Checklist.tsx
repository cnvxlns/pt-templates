import { Checklist } from "@/components";

export default function Example() {
  return (
    <Checklist
      items={[
        { label: "오프라인 평가", detail: "검증 세트 전 항목 통과" },
        { label: "장시간 안정성", detail: "연속 가동 시험 없음", state: "todo" },
        { label: "야간 시나리오", state: "fail" },
      ]}
    />
  );
}
