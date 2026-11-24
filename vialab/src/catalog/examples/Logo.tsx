import { Row, Logo } from "@/components";

export default function Example() {
  return (
    <Row gap={80} align="center">
      <Logo width={300} />
      <Logo />
    </Row>
  );
}
