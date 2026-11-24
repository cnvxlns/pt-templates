import { FlowSteps } from "@/components";

export default function Example() {
  return (
    <FlowSteps
      steps={[
        { title: "수집" },
        { title: "전처리", detail: "정제 · 라벨링" },
        { title: "학습" },
        { title: "평가", emphasis: true },
        { title: "차량 실험", dark: true },
      ]}
    />
  );
}
