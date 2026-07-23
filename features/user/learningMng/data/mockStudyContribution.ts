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
function getSeedFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function generateMockStudyContributionData(memberId?: string): StudyContributionItem[] {
  const items: StudyContributionItem[] = [];
  const today = new Date();
  
  const hasMember = !!memberId;
  const seed = hasMember ? getSeedFromString(memberId) : 12345;
  let currentSeed = seed;

  const nextRandom = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  // 365일 루프 (오늘이 마지막 날이 되도록)
  for (let i = 364; i >= 0; i--) {
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 0, 0, 0, 0);
    const dateStr = formatLocalYYYYMMDD(currentDate);

    let isActive = false;
    let studyMinutes = 0;

    if (hasMember) {
      // 회원 상세 조회 시, 회원의 학습 패턴에 맞는 학습 잔디 생성
      // 0.3 ~ 0.6 사이의 임계치 -> 활성화율 약 40% ~ 70%
      const activationThreshold = 0.3 + (nextRandom() * 0.3);
      isActive = nextRandom() > activationThreshold;
      
      if (isActive) {
        const rand = nextRandom();
        if (rand < 0.25) {
          studyMinutes = 15 + Math.floor(nextRandom() * 15); // Stage 1 (15~30)
        } else if (rand < 0.55) {
          studyMinutes = 35 + Math.floor(nextRandom() * 20); // Stage 2 (35~55)
        } else if (rand < 0.85) {
          studyMinutes = 65 + Math.floor(nextRandom() * 45); // Stage 3 (65~110)
        } else {
          studyMinutes = 120 + Math.floor(nextRandom() * 70); // Stage 4 (120~190)
        }
      }
    } else {
      // 기존 로그인 유저용 디폴트 데이터 로직 유지 (연속 학습 12일, 24일 보장)
      const isCurrentStreak = i >= 0 && i <= 11;
      const isCurrentStreakBreak = i === 12;

      const isMaxStreak = i >= 37 && i <= 60;
      const isMaxStreakBreakBefore = i === 61;
      const isMaxStreakBreakAfter = i === 36;

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
        const mode = i % 4;
        if (mode === 0) {
          studyMinutes = 15 + (i % 10);
        } else if (mode === 1) {
          studyMinutes = 35 + (i % 15);
        } else if (mode === 2) {
          studyMinutes = 70 + (i % 30);
        } else {
          studyMinutes = 130 + (i % 40);
        }
      }
    }

    if (isActive) {
      // 과목별 공부시간 분할
      const minSubject1 = Math.round(studyMinutes * 0.45);
      const minSubject2 = Math.round(studyMinutes * 0.35);
      const minSubject3 = Math.max(0, studyMinutes - minSubject1 - minSubject2);

      const subjects = [
        { subjectName: "중개사법 및 실무", studyMinutes: minSubject1 },
        { subjectName: "부동산공법", studyMinutes: minSubject2 },
        { subjectName: "부동산세법", studyMinutes: minSubject3 },
      ].filter((sub) => sub.studyMinutes > 0);

      const questionCount = Math.floor(studyMinutes / 3) + (hasMember ? Math.floor(nextRandom() * 5) : (i % 5));

      const exams = [];
      if (!hasMember) {
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
