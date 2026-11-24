import { StatGrid, Stat } from "@/components";

export default function Example() {
  return (
    <StatGrid columns={3}>
      <Stat accent value="92.4" label="mAP" note="기존 대비 +3.1" />
      <Stat value="18" unit="ms" label="추론 지연" note="RTX 4090 기준" />
      <Stat size="sm" value="4.2k" label="주행 시나리오" note="size=&quot;sm&quot;" />
    </StatGrid>
  );
}
