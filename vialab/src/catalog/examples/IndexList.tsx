import { IndexList } from "@/components";

export default function Example() {
  return (
    <IndexList
      items={[
        { label: "연구 배경", detail: "slide 4–9" },
        { label: "제안 방법" },
        { label: "부록", num: "A" },
      ]}
    />
  );
}
