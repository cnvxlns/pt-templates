import { ClosingSlide, ContentSlide, CoverSlide, DeckStage, Panel } from "@/components";

export default function TemplateDeck() {
  return (
    <DeckStage title="PULSE 발표 템플릿">
      <CoverSlide
        label="표지"
        eyebrow="ALGORITHM STUDY"
        title={<>구간 합<span className="pulse-accent">과</span><br />누적 합</>}
        lead="같은 배열에서 합을 여러 번 구하려면?"
        footer="PULSE · 스터디 발표 예제"
      />
      <ContentSlide label="핵심 개념" title="여러 쿼리에서 사용할 합을 미리 저장합니다">
        <p className="pulse-lead">같은 배열에서 여러 구간의 합을 구한다고 가정합니다.</p>
        <div className="pulse-grid">
          <Panel title="구간마다 더하기">
            <p>왼쪽 끝부터 오른쪽 끝까지 원소를 하나씩 더합니다.</p>
            <p className="pulse-formula">O(N)</p>
          </Panel>
          <Panel title="누적 합에서 빼기" accent>
            <p>오른쪽 끝까지의 합에서 왼쪽 끝 직전까지의 합을 뺍니다.</p>
            <p className="pulse-formula">O(1)</p>
          </Panel>
        </div>
        <p className="pulse-callout">누적 합 배열을 준비하는 데 O(N) 시간과 공간을 사용합니다.</p>
      </ContentSlide>
      <ContentSlide label="예제 풀이" title="두 누적 합의 차로 구간 합을 구합니다">
        <p className="pulse-lead">배열 [2, 1, 4, 3]에서 처음 k개의 합을 P[k]에 저장합니다.</p>
        <table className="pulse-table">
          <caption>처음 k개 원소의 합</caption>
          <thead><tr><th scope="col">k</th><th scope="col">P[k]</th></tr></thead>
          <tbody>
            {[0, 2, 3, 7, 10].map((sum, index) => (
              <tr key={index}><th scope="row">{index}</th><td>{sum}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="pulse-callout">두 번째부터 네 번째 원소까지의 합은 P[4] − P[1] = 10 − 2 = 8입니다.</p>
      </ContentSlide>
      <ClosingSlide
        label="마무리"
        eyebrow="PULSE"
        title={<>반복해서 쓰는 합은<br /><span className="pulse-accent">한 번 계산해 둡니다.</span></>}
        lead="구간마다 다시 더하는 일을 줄일 수 있습니다."
      />
    </DeckStage>
  );
}
