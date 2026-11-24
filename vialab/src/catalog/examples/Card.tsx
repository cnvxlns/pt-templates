import { CardGrid, Card } from "@/components";

export default function Example() {
  return (
    <CardGrid columns={3} gap={36}>
      <Card variant="outline" index="01" title="outline">기본값. 테두리 상자</Card>
      <Card variant="paper" eyebrow="eyebrow" title="paper">옅은 회색 면</Card>
      <Card variant="rule" accent title="rule + accent">윗선만, accent 면 오렌지</Card>
      <Card variant="dark" index="02" title="dark">검정 면</Card>
      <Card variant="accent" index="03" title="accent">오렌지 면</Card>
      <Card variant="plain" title="plain">장식 없음</Card>
    </CardGrid>
  );
}
