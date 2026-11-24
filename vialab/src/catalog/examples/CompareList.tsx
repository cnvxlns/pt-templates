import { CompareList } from "@/components";

export default function Example() {
  return (
    <CompareList
      rows={[
        { label: "설정 파일 (저장값)", value: "mode_a" },
        { label: "프로그램이 보고한 값", value: "mode_a" },
        { label: "장치의 실제 동작", value: "default", emphasis: true },
      ]}
    />
  );
}
