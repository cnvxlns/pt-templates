import { CodeBlock, Dim, Ok, Err, Hl } from "@/components";

export default function Example() {
  return (
    <CodeBlock title="terminal">
      <Dim>{"# Dim / Ok / Err / Hl 을 문자열과 섞는다\n"}</Dim>
      {"status : "}
      <Ok>succeeded</Ok>
      {"\ncode   : "}
      <Err>404</Err>
      {"\nscript : "}
      <Hl>train.py</Hl>
    </CodeBlock>
  );
}
