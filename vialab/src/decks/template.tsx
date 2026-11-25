/*
 * VIALab-Template.html 의 11장을 컴포넌트로 재현한 원본 템플릿.
 * 새 발표를 시작할 때 이 파일을 복사해서 src/decks/ 에 두고 registry.ts 에 등록한다.
 */
import {
  AgendaSlide,
  BulletList,
  ClosingSlide,
  ContentSlide,
  CoverSlide,
  DataTable,
  DeckStage,
  FullBleedSlide,
  Lead,
  Placeholder,
  SectionSlide,
  SplitSlide,
  Stat,
  StatGrid,
  StatementSlide,
  Timeline,
} from "@/components";

export default function TemplateDeck() {
  return (
    <DeckStage title="VIALab · Lab Meeting Template">
      <CoverSlide
        label="표지"
        title="발표 제목을 입력합니다"
        subtitle="부제 또는 한 줄 요약"
        presenter="홍길동 · 박사과정"
        date="2026.09.18"
      />

      <AgendaSlide label="목차" items={["연구 배경", "제안 방법", "실험 결과", "향후 계획"]} />

      <SectionSlide label="섹션 구분" number="01" title="연구 배경" description="이 섹션에서 다룰 내용을 한 줄로 적습니다." />

      <ContentSlide label="본문 · 텍스트" title="핵심 내용" gap={80}>
        <BulletList items={["첫 번째 요점을 한 문장으로 적습니다.", "두 번째 요점을 한 문장으로 적습니다.", "세 번째 요점을 한 문장으로 적습니다."]} />
      </ContentSlide>

      <SplitSlide
        label="본문 · 2단"
        title="제안 방법"
        aside={<Placeholder label="system diagram" height={720} />}
      >
        <Lead>구조나 파이프라인을 두세 문장으로 설명합니다. 세부 수식은 부록으로 옮기고 여기서는 흐름만 남깁니다.</Lead>
      </SplitSlide>

      <FullBleedSlide
        label="전체 이미지"
        title="정성 결과"
        caption="장면 설명을 한 줄로 적습니다."
        media={<Placeholder dark label="driving scene / qualitative result" style={{ flex: 1 }} />}
      />

      <ContentSlide label="수치 강조" title="정량 결과" gap={110}>
        <StatGrid columns={3}>
          <Stat accent value="92.4" label="mAP" note="기존 대비 +3.1" />
          <Stat value="18ms" label="추론 지연" note="RTX 4090 기준" />
          <Stat value="4.2k" label="주행 시나리오" note="자체 수집 데이터셋" />
        </StatGrid>
      </ContentSlide>

      <ContentSlide label="비교 표" title="방법 비교" gap={80}>
        <DataTable
          columns={[
            "방법",
            { header: "정확도", align: "right", num: true },
            { header: "지연", align: "right", num: true },
            { header: "파라미터", align: "right", num: true },
          ]}
          rows={[
            ["Baseline A", "89.3", "24ms", "31M"],
            ["Baseline B", "90.1", "21ms", "28M"],
            ["Ours", "92.4", "18ms", "24M"],
          ]}
          highlight={[2]}
        />
      </ContentSlide>

      <ContentSlide label="진행 일정" title="향후 계획" gap={120}>
        <Timeline
          items={[
            { period: "WEEK 1–2", title: "데이터 정제", state: "active" },
            { period: "WEEK 3–4", title: "모델 학습", state: "done" },
            { period: "WEEK 5–6", title: "차량 실험" },
            { period: "WEEK 7–8", title: "논문 작성" },
          ]}
        />
      </ContentSlide>

      <StatementSlide label="핵심 문장" source="Reference / Source">
        강조하고 싶은 한 문장을 이 자리에 둡니다.
      </StatementSlide>

      <ClosingSlide label="마무리" questions={["첫 번째 질문", "두 번째 질문"]} />
    </DeckStage>
  );
}
