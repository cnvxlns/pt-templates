import { FullBleedSlide, Placeholder } from "@/components";

export default function Example() {
  return (
    <FullBleedSlide
      label="정성 결과"
      title="정성 결과"
      caption="장면 설명을 한 줄로 적습니다."
      media={<Placeholder dark label="driving scene" style={{ flex: 1 }} />}
    />
  );
}
