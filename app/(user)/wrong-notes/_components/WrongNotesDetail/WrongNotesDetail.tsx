"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Compass, Bookmark, Star } from "lucide-react";
import { ExamListItem } from "../../../../../features/exam/types/exam";
import { WrongNote } from "../../../../../features/dashboard/hooks/useDashboardData";
import styles from "./WrongNotesDetail.module.css";

interface QuestionDetail {
  id: string;
  passage?: string;
  title: string;
  options: string[];
  correctAnswer: number; // 1-indexed (1 ~ 5)
  userAnswer: number; // 1-indexed
  explanation: string;
  isBookmarked: boolean;
  difficulty: number; // 1 ~ 3
}

const MOCK_QUESTION_DETAILS: Record<string, QuestionDetail> = {
  "wrong-1": {
    id: "wrong-1",
    title: "지방세법상 취득세의 과세표준에 관한 설명으로 옳은 것은?",
    options: [
      "취득세의 과세표준 is 취득 당시의 가액으로 한다. 다만, 연부로 취득하는 경우에는 연부금액으로 한다.",
      "신고가액이 시가표준액보다 적을 때에는 신고가액을 과세표준으로 한다.",
      "판결문에 따라 취득가격이 증명되는 취득의 경우에는 시가표준액을 과세표준으로 한다.",
      "취득 권리를 이전받은 자의 사실상 취득가격이 시가표준액보다 낮은 경우 시가표준액을 기준으로 한다.",
      "법인이 아닌 자가 건축물을 건축하여 취득하는 경우로서 법인장부로 100분의 80이 증명되는 경우 시가표준액으로 한다."
    ],
    correctAnswer: 1,
    userAnswer: 3,
    explanation: "취득세의 과세표준은 취득 당시의 가액(일반적 가액)으로 하되, 연부 취득의 경우에는 연부금액으로 하는 것이 원칙입니다.\n\n[오답 분석]\n- ② 신고가액이 시가표준액보다 적을 때에는 '시가표준액'을 과세표준으로 합니다.\n- ③ 판결문·법인장부 등으로 사실상 취득가격이 증명되는 경우 '사실상의 취득가격'을 과세표준으로 합니다.\n- ⑤ 법인이 아닌 자의 건축물 건축 시 법인장부로 100분의 90 이상 증명되는 경우 사실상 취득가액을 적용합니다.",
    isBookmarked: true,
    difficulty: 3
  },
  "wrong-2": {
    id: "wrong-2",
    passage: "[사례] A지방자치단체장은 용도지역이 미지정된 구역에 대해 개발 제한 기준을 정하고자 한다. 이때 적용하여야 할 규정은 무엇인가?",
    title: "국토의 계획 및 이용에 관한 법률상 용도지역의 지정에 관한 설명으로 틀린 것은?",
    options: [
      "도시지역, 관리지역, 농림지역 또는 자연환경보전지역으로 용도가 지정되지 아니한 지역에 대하여는 자연환경보전지역에 관한 규정을 적용한다.",
      "용도지역을 변경하는 경우에는 도시·군관리계획의 결정으로 하여야 한다.",
      "공유수면의 매립목적이 그 매립구역과 이웃하고 있는 용도지역의 내용과 같은 경우 도시·군관리계획의 결정 없이 이웃 용도지역으로 지정된 것으로 본다.",
      "관리지역에서 농지법에 따른 농업진흥지역으로 지정·고시된 지역은 농림지역으로 결정·고시된 것으로 본다.",
      "세분할 수 있는 용도지역 중 상업지역은 근린상업, 유통상업, 전용상업, 일반상업지역으로 세분된다."
    ],
    correctAnswer: 5,
    userAnswer: 1,
    explanation: "국토계획법상 상업지역은 중심상업지역, 일반상업지역, 근린상업지역, 유통상업지역으로 구분되며 '전용상업지역'이라는 명칭의 용도구분은 존재하지 않습니다. 따라서 5번이 오답입니다.",
    isBookmarked: false,
    difficulty: 2
  },
  "wrong-3": {
    id: "wrong-3",
    title: "공인중개사법령상 개업공인중개사 등의 금지행위에 해당하지 않는 것은?",
    options: [
      "중개대상물의 매매를 업으로 하는 행위",
      "중개의뢰인과 직접 거래를 하거나 거래당사자 쌍방을 대리하는 행위",
      "사례·증여 등 어떠한 명목으로도 법정 보수를 초과하여 금품을 받는 행위",
      "무등록 중개업을 영위하는 자인 사실을 알면서 그를 통하여 중개를 의뢰받거나 그에게 자기의 명의를 이용하게 하는 행위",
      "상업용 건축물의 분양대행을 하고 법정 수수료율을 초과한 분양수수료(대행료)를 받는 행위"
    ],
    correctAnswer: 5,
    userAnswer: 3,
    explanation: "상업용 건축물의 분양대행이나 상담 등은 중개업무와 별개의 겸업업무이므로, 공인중개사법에 규정된 중개보수 제한 규정이 적용되지 않습니다. 따라서 고액의 수수료를 받아도 금지행위에 위반되지 않습니다.",
    isBookmarked: true,
    difficulty: 1
  },
  "wrong-4": {
    id: "wrong-4",
    title: "지방세법상 등록면허세의 세율 및 비과세에 관한 설명으로 옳은 것은?",
    options: [
      "부동산 등기에 대한 등록면허세 표준세율은 지방자치단체의 조례로 정하는 바에 따라 100분의 50 범위에서 가감할 수 있다.",
      "대한민국 정부기관의 등록에 대하여 과세하는 외국정부의 등록에 대해서는 등록면허세를 비과세한다.",
      "전세권 설정 등기의 등록면허세 표준세율은 전세금액의 1천분의 10으로 한다.",
      "저당권 설정 등기의 표준세율은 채권금액의 1천분의 5로 한다.",
      "등록면허세 세액이 1만원 미만인 경우에는 등록면허세를 징수하지 아니한다."
    ],
    correctAnswer: 1,
    userAnswer: 5,
    explanation: "등록면허세 표준세율은 지자체 조례에 의거 100분의 50 범위에서 가감할 수 있습니다. 전세권/저당권 등기의 세율은 1천분의 2이며, 최저 한도 세액은 6,000원이므로 세액이 6,000원 미만인 경우 6,000원을 징수합니다.",
    isBookmarked: false,
    difficulty: 2
  },
  "wrong-5": {
    id: "wrong-5",
    title: "도시개발법상 도시개발구역의 지정권자 및 지정 해제에 관한 설명으로 틀린 것은?",
    options: [
      "도시개발사업이 필요한 지역이 둘 이상의 도 또는 특별자치도의 행정구역에 걸치는 경우에는 관계 도지사가 협의하여 지정할 자를 정한다.",
      "국토교통부장관은 천재지변이나 그 밖의 사유로 인하여 도시개발사업을 긴급하게 할 필요가 있는 경우 구역을 지정할 수 있다.",
      "도시개발구역의 지정은 개발계획 수립 후 3년이 되는 날까지 실시계획 승인을 신청하지 않는 경우 그 다음 날 해제된 것으로 본다.",
      "도시개발구역 지정 후 개발계획을 수립하는 경우, 구역 지정 고시일부터 2년이 되는 날까지 개발계획을 수립하지 않으면 그 다음 날 구역 지정이 해제된 것으로 본다.",
      "구역 해제 의제 결정이 있을 시, 그 구역은 용도지역이 지정 이전 상태로 환원된 것으로 보지 아니한다."
    ],
    correctAnswer: 5,
    userAnswer: 2,
    explanation: "사업 완료(준공고시) 이외의 사유로 도시개발구역이 해제되면 지정 이전의 용도지역 및 개발진흥지구로 환원된 것으로 봅니다. 따라서 환원되지 않는다는 5번이 틀렸습니다.",
    isBookmarked: true,
    difficulty: 3
  },
  "wrong-6": {
    id: "wrong-6",
    title: "건축법상 건축허가 및 신고에 관한 설명으로 옳은 것은?",
    options: [
      "21층 이상의 건축물 등 대통령령으로 정하는 용도 및 규모의 건축물을 특별시나 광역시에 건축하려면 특별시장이나 광역시장의 허가를 받아야 한다.",
      "바닥면적의 합계가 85제곱미터 이내의 증축·개축 또는 재축은 특별자치시장·특별자치도지사 또는 시장·군수·구청장에게 허가를 받아야 한다.",
      "건축신고를 한 자가 신고일부터 1년 이내에 공사에 착수하지 아니하면 그 신고의 효력은 상실된다. 다만 건축주의 요청으로 허가권자가 인정 시 1년 범위에서 연장 가능하다.",
      "건축허가를 받은 자는 허가를 받은 날부터 1년 이내에 공사에 착수하여야 한다.",
      "허가권자는 건축허가를 하고자 할 때 국토교통부장관의 사전 승인을 받아야 한다."
    ],
    correctAnswer: 1,
    userAnswer: 3,
    explanation: "1. 21층 이상 또는 연면적 10만㎡ 이상의 대형 건축물은 특별시장/광역시장의 허가를 받도록 규정하고 있습니다.\n- ② 85㎡ 이내 증개재축은 신고 사항입니다.\n- ④ 건축허가 후 착수 기한은 2년(공장 3년) 이내입니다.",
    isBookmarked: false,
    difficulty: 1
  },
  "wrong-7": {
    id: "wrong-7",
    title: "부동산 거래신고 등에 관한 법률상 부동산 거래신고에 관한 설명으로 틀린 것은?",
    options: [
      "거래당사자는 부동산등의 매매계약을 체결한 경우 그 실제 거래가격 등 대통령령으로 정하는 사항을 거래계약의 체결일부터 30일 이내에 신고관청에 공동으로 신고하여야 한다.",
      "거래당사자 중 일방이 신고를 거부하는 경우에는 국토교통부령으로 정하는 바에 따라 단독으로 신고할 수 있다.",
      "개업공인중개사가 거래계약서를 작성·교부한 경우에는 개업공인중개사가 거래신고를 하여야 하며 거래당사자는 신고의무가 없다.",
      "부동산 거래계약 해제등이 확정된 날부터 30일 이내에 신고하지 아니한 자에게는 500만원 이하의 과태료를 부과한다.",
      "실제 거래가격을 거짓으로 신고한 자에게는 취득가액의 100분의 10 이하에 상당하는 금액의 과태료를 부과한다."
    ],
    correctAnswer: 5,
    userAnswer: 1,
    explanation: "거래가액을 거짓 신고한 경우에는 법률 제28조에 따라 3천만원 이하의 과태료(매매가액 3억원 미만) 또는 취득가액의 100분의 10 이하 상당의 과태료 기준상 오차가 존재하나, 5번이 출제 법령 오답 요건으로 의도되었습니다.",
    isBookmarked: true,
    difficulty: 2
  }
};

interface WrongNotesDetailProps {
  selectedExam: ExamListItem;
  examNotes: WrongNote[];
  onBack: () => void;
  cardCauses: Record<string, "unknown" | "confused" | "mistake">;
  onCauseChange: (cardId: string, newCause: "unknown" | "confused" | "mistake") => void;
}

export function WrongNotesDetail({
  selectedExam,
  examNotes,
  onBack,
  cardCauses,
  onCauseChange,
}: WrongNotesDetailProps) {
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);

  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    examNotes.forEach((note) => {
      const q = MOCK_QUESTION_DETAILS[note.id];
      initial[note.id] = q ? q.isBookmarked : false;
    });
    return initial;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (examNotes.length === 0) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <h2 className={styles.examTitle}>{selectedExam.title} 오답노트</h2>
          </div>
          <button onClick={onBack} className={styles.backButton}>
            ← 시험 목록으로
          </button>
        </div>
        <div className={styles.emptyState}>이 시험에 해당하는 오답 내역이 없습니다.</div>
      </div>
    );
  }

  const activeNote = examNotes[activeNoteIndex];
  const qDetail = MOCK_QUESTION_DETAILS[activeNote.id] || {
    id: activeNote.id,
    title: `${activeNote.subject} - ${activeNote.topic} 관련 개념 평가`,
    options: [
      "지문 예시 1번 항목",
      "지문 예시 2번 항목",
      "지문 예시 3번 항목",
      "지문 예시 4번 항목",
      "지문 예시 5번 항목"
    ],
    correctAnswer: 1,
    userAnswer: 2,
    explanation: "상세 기출 설명 및 풀이가 누락되었습니다. 기본서의 해당 단원을 참조하세요.",
    isBookmarked: false,
    difficulty: 2
  };

  const currentCause = cardCauses[activeNote.id] || "unknown";

  const handlePrev = () => {
    if (activeNoteIndex > 0) {
      setActiveNoteIndex(activeNoteIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeNoteIndex < examNotes.length - 1) {
      setActiveNoteIndex(activeNoteIndex + 1);
    }
  };

  const diagnosticButtons: { id: "unknown" | "confused" | "mistake"; label: string }[] = [
    { id: "unknown", label: "아예 모름" },
    { id: "confused", label: "애매함" },
    { id: "mistake", label: "실수함" }
  ];

  // aiSummary 파싱
  const aiLines = activeNote.aiSummary.split("\n");
  const conceptSummary = aiLines[0] || "핵심 개념 정리";
  const aiDiagnosis = aiLines[1] || "개념 복습 권장";

  return (
    <div className={styles.detailContainer}>
      {/* 상단 헤더 및 뒤로가기 */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h2 className={styles.examTitle}>{selectedExam.title} 오답노트</h2>
        </div>
        <button onClick={onBack} className={styles.backButton}>
          ← 시험 목록으로
        </button>
      </div>

      {/* 좌/우 분할 화면 */}
      <div className={styles.splitPane}>
        {/* 좌측 패널: 문제 내용 및 선택지 */}
        <div className={styles.leftPanel}>
          <div className={styles.card}>
            <span className={styles.panelLabel}>문제</span>

            <div className={styles.questionIndicator}>
              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>
                  Q{activeNoteIndex + 1}
                </span>

                {/* 북마크 여부 표시 및 토글 */}
                <button
                  type="button"
                  onClick={() => toggleBookmark(activeNote.id)}
                  className={`${styles.bookmarkBadge} ${
                    bookmarks[activeNote.id] ? styles.bookmarkActive : ""
                  }`}
                  title={bookmarks[activeNote.id] ? "북마크 해제" : "북마크 추가"}
                >
                  <Bookmark
                    className={`w-[16px] h-[16px] ${
                      bookmarks[activeNote.id] ? "fill-[#C93A35]" : ""
                    }`}
                  />
                  <span>{bookmarks[activeNote.id] ? "북마크됨" : "북마크 없음"}</span>
                </button>

                {/* 난이도 별 표시 */}
                <div className={styles.difficultyGroup}>
                  <span className={styles.difficultyLabel}>난이도:</span>
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-[14px] h-[14px] ${
                        star <= (qDetail.difficulty || 2)
                          ? styles.starFilled
                          : styles.starEmpty
                      }`}
                    />
                  ))}
                </div>
              </div>

              <span className={styles.questionChapter}>
                {activeNote.chapter} &gt; {activeNote.topic}
              </span>
            </div>

            {/* 지문이 있는 경우 렌더링 */}
            {qDetail.passage && (
              <div className={styles.passageContainer}>
                {qDetail.passage}
              </div>
            )}

            <h3 className={styles.questionTitle}>
              {qDetail.title}
            </h3>

            {/* 5지선다 선택지 목록 */}
            <div className={styles.optionsList}>
              {qDetail.options.map((opt, i) => {
                const optNum = i + 1;
                const isCorrect = qDetail.correctAnswer === optNum;
                const isUserChoice = qDetail.userAnswer === optNum;

                let optClass = styles.optionItem;
                if (isCorrect) optClass = `${styles.optionItem} ${styles.optionCorrect}`;
                else if (isUserChoice) optClass = `${styles.optionItem} ${styles.optionWrong}`;

                return (
                  <div key={i} className={optClass}>
                    <span className={`${styles.optionBadge} ${isCorrect
                      ? styles.badgeCorrect
                      : isUserChoice
                        ? styles.badgeWrong
                        : ""
                      }`}>
                      {optNum}
                    </span>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* 하단 이전/다음 네비게이션 */}
            <div className={styles.navigationContainer}>
              <button
                onClick={handlePrev}
                disabled={activeNoteIndex === 0}
                className={styles.navButton}
              >
                <ChevronLeft className="w-4 h-4" />
                이전 문제
              </button>
              <span className={styles.navProgressText}>
                {activeNoteIndex + 1} / {examNotes.length}
              </span>
              <button
                onClick={handleNext}
                disabled={activeNoteIndex === examNotes.length - 1}
                className={styles.navButton}
              >
                다음 문제
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 우측 패널: 해설 및 AI 분석 */}
        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <span className={styles.panelLabel}>해설</span>
            {/* 핵심 개념 */}
            <div className={styles.explanationSection}>
              <span className={styles.explanationLabel}>핵심 개념</span>
              <div className={styles.passageContainer}>
                {conceptSummary}
              </div>
            </div>

            {/* 문제 해설 */}
            <div className={styles.explanationSection}>
              <span className={styles.explanationLabel}>정답 및 상세 해설</span>
              <p className={styles.explanationText}>
                {qDetail.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
