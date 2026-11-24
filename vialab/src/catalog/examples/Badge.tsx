import { Row, Badge } from "@/components";

export default function Example() {
  return (
    <Row gap={16}>
      <Badge status="pass">pass</Badge>
      <Badge status="fail">fail</Badge>
      <Badge status="warn">warn</Badge>
      <Badge status="neutral">neutral</Badge>
      <Badge status="accent">accent</Badge>
      <Badge status="solid">solid</Badge>
    </Row>
  );
}
