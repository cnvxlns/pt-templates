import { Timeline } from "@/components";

export default function Example() {
  return (
    <Timeline
      items={[
        { period: "WEEK 1–2", title: "데이터 정제", state: "done" },
        { period: "WEEK 3–4", title: "모델 학습", state: "active", detail: "지금 여기" },
        { period: "WEEK 5–6", title: "차량 실험" },
        { period: "WEEK 7–8", title: "논문 작성" },
      ]}
    />
  );
}
