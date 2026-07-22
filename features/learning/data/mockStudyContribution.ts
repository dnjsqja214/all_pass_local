import { StudyContributionItem } from "../types";

/**
 * 로컬 타임존 기준으로 YYYY-MM-DD 날짜 문자열을 만드는 헬퍼 함수
 */
export function formatLocalYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 최근 365일간의 학습 잔디용 모의 데이터를 생성합니다.
 * - 현재 연속 학습: 12일 (오늘 기준 12일 전부터 오늘까지 연속 공부)
 * - 최장 연속 학습: 24일 (오늘 기준 60일 전부터 37일 전까지 연속 공부)
 * - 그 외 기간은 규칙적으로 공백(5일마다 비활성화)을 둠으로써 최장 연속 학습이 24일로 고정되도록 설계
 */
export function generateMockStudyContributionData(): StudyContributionItem[] {
  const items: StudyContributionItem[] = [];
  const today = new Date();
  
  // 365일 루프 (오늘이 마지막 날이 되도록)
  for (let i = 364; i >= 0; i--) {
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 0, 0, 0, 0);
    const dateStr = formatLocalYYYYMMDD(currentDate);

    // i는 오늘 기준으로 며칠 전인지를 나타됨 (오늘: i=0)
    const isCurrentStreak = i >= 0 && i <= 11;
    const isCurrentStreakBreak = i === 12;

    const isMaxStreak = i >= 37 && i <= 60;
    const isMaxStreakBreakBefore = i === 61;
    const isMaxStreakBreakAfter = i === 36;

    let isActive = false;

    if (isCurrentStreak) {
      isActive = true;
    } else if (isCurrentStreakBreak) {
      isActive = false;
    } else if (isMaxStreak) {
      isActive = true;
    } else if (isMaxStreakBreakBefore || isMaxStreakBreakAfter) {
      isActive = false;
    } else {
      isActive = i % 5 !== 0;
    }

    if (isActive) {
      let studyMinutes = 0;
      const mode = i % 4;
      if (mode === 0) {
        studyMinutes = 15 + (i % 10); // 15~24분 (Stage 1)
      } else if (mode === 1) {
        studyMinutes = 35 + (i % 15); // 35~49분 (Stage 2)
      } else if (mode === 2) {
        studyMinutes = 70 + (i % 30); // 70~99분 (Stage 3)
      } else {
        studyMinutes = 130 + (i % 40); // 130~169분 (Stage 4)
      }

      // 과목별 공부시간 분할
      const minSubject1 = Math.round(studyMinutes * 0.45);
      const minSubject2 = Math.round(studyMinutes * 0.35);
      const minSubject3 = Math.max(0, studyMinutes - minSubject1 - minSubject2);

      const subjects = [
        { subjectName: "중개사법 및 실무", studyMinutes: minSubject1 },
        { subjectName: "부동산공법", studyMinutes: minSubject2 },
        { subjectName: "부동산세법", studyMinutes: minSubject3 },
      ].filter((sub) => sub.studyMinutes > 0);

      const questionCount = Math.floor(studyMinutes / 3) + (i % 5);

      // 시험 정보 데이터 결합 (특정 날짜 매핑 예시)
      // '2026-07-06' (약 16일 전 부근) 및 '2026-07-04' (약 18일 전 부근)
      // 실제 오늘 날짜에 가깝게 상대적으로 연계
      const exams = [];
      if (i === 16) {
        exams.push({
          examTitle: "제35회 공인중개사 1차 시험 - 1회차",
          score: 175,
          isPassed: false,
        });
      } else if (i === 18) {
        exams.push({
          examTitle: "제34회 공인중개사 1차 시험 - 2회차",
          score: 185,
          isPassed: true,
        });
      }

      items.push({
        studyDate: dateStr,
        studyMinutes,
        questionCount,
        subjects,
        exams: exams.length > 0 ? exams : undefined,
      });
    } else {
      items.push({
        studyDate: dateStr,
        studyMinutes: 0,
        questionCount: 0,
        subjects: [],
      });
    }
  }

  return items;
}

export const mockStudyContributionData = generateMockStudyContributionData();
