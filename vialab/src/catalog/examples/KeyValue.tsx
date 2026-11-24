import { KeyValue, Code } from "@/components";

export default function Example() {
  return (
    <KeyValue
      keyWidth={220}
      items={[
        ["GPU", "RTX 4090 × 2"],
        ["프레임워크", <><Code>torch</Code> 2.5</>],
        ["데이터", "자체 수집 4.2k 시나리오"],
      ]}
    />
  );
}
