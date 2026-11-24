import { Callout, Code } from "@/components";

export default function Example() {
  return (
    <Callout label="참고">
      학습 설정은 <Code>configs/train.yaml</Code> 에 있다. 배치 크기만 바꿔도 결과가 달라진다.
    </Callout>
  );
}
