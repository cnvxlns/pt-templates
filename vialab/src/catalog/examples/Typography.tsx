import { Stack, AccentBar, Eyebrow, H1, H2, H3, Lead, Text, Hl, B, Code, Num } from "@/components";

export default function Example() {
  return (
    <Stack gap={28}>
      <AccentBar />
      <Eyebrow>Eyebrow — 제목 위 영문 라벨</Eyebrow>
      <H1>H1 표지 제목 104</H1>
      <H2>H2 슬라이드 제목 64</H2>
      <H3>H3 소제목 40</H3>
      <Lead>Lead 36 light — <Hl>Hl</Hl> 강조, <B>B</B> 굵게, <Code>Code</Code> 식별자</Lead>
      <Text>Text 32 본문 · 숫자는 <Num accent>92.4</Num></Text>
      <Text size="sm" muted>Text size=&quot;sm&quot; muted — 28 보조 설명</Text>
    </Stack>
  );
}
