import { Figure } from "@/components";

export default function Example() {
  return (
    <Figure
      src="/vialab-logo.png"
      alt="VIALab 로고"
      num="Fig. 1"
      caption="그림은 public/decks/<덱>/ 에 두고 /decks/<덱>/파일명 으로 쓴다."
      style={{ height: 320 }}
    />
  );
}
