import { Stack, Row, Columns, Spacer, Divider, Placeholder } from "@/components";

export default function Example() {
  return (
    <Stack gap={30}>
      <Columns cols="1fr 2fr" gap={40}>
        <Placeholder label="Columns 1fr" height={140} />
        <Placeholder label="2fr" height={140} />
      </Columns>
      <Divider />
      <Row gap={20}>
        <Placeholder label="Row" height={100} style={{ width: 300 }} />
        <Spacer />
        <Placeholder label="Spacer 로 밀기" height={100} style={{ width: 400 }} />
      </Row>
    </Stack>
  );
}
