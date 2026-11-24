import { Columns, Placeholder } from "@/components";

export default function Example() {
  return (
    <Columns cols={2} gap={40}>
      <Placeholder label="system diagram" height={360} />
      <Placeholder dark label="driving scene" height={360} />
    </Columns>
  );
}
