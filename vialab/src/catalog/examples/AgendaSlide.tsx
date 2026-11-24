import { AgendaSlide } from "@/components";

export default function Example() {
  return (
    <AgendaSlide
      label="목차"
      items={["연구 배경", "제안 방법", { label: "실험 결과", detail: "정량 · 정성" }, "향후 계획"]}
    />
  );
}
