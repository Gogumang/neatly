import { ErrorBoundary } from "@suspensive/react";
import type { Talk, Template } from "@/entities/talk/model";
import { ChatScene } from "./ChatScene";
import { ImageScene } from "./ImageScene";
import { KeywordsScene } from "./KeywordsScene";
import { MockupScene } from "./MockupScene";
import { RollingNumberScene } from "./RollingNumberScene";
import { SpeakerScene } from "./SpeakerScene";
import { TitleScene } from "./TitleScene";

/**
 * 장면 템플릿 종류에 맞는 화면을 그린다.
 * AI 가 만든 데이터가 어긋나 한 장면이 깨져도, 자막·나레이션은 계속 진행되도록 화면만 비운다.
 */
type Props = {
  template: Template;
  author: Talk["author"];
  /** 작은 미리보기: 숫자를 굴리지 않고 결과만 보여준다 */
  still?: boolean;
};

export function SceneTemplate({ template, author, still }: Props) {
  return (
    <ErrorBoundary
      resetKeys={[template]}
      fallback={null}
      onError={(error) => console.error("장면을 그리지 못했어요", error)}
    >
      <Scene template={template} author={author} still={still} />
    </ErrorBoundary>
  );
}

function Scene({ template, author, still }: Props) {
  switch (template.type) {
    case "title":
      return <TitleScene {...template} />;
    case "keywords":
      return <KeywordsScene keywords={template.keywords} />;
    case "rollingNumber":
      return <RollingNumberScene {...template} still={still} />;
    case "mockup":
      return <MockupScene {...template} />;
    case "chat":
      return <ChatScene messages={template.messages} />;
    case "speaker":
      return <SpeakerScene author={author} />;
    case "image":
      return <ImageScene {...template} />;
  }
}
