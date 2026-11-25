import { Slide, SlideHeader, Columns, Placeholder } from "@/components";

export default function Example() {
  return (
    <Slide label="자유 구성" tone="light">
      <SlideHeader title="정해진 레이아웃이 없을 때" />
      <Columns cols="1fr 2fr" gap={60} fill style={{ marginTop: 60 }}>
        <Placeholder label="a" />
        <Placeholder label="b" />
      </Columns>
    </Slide>
  );
}
