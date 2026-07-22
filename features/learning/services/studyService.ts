import { StudyContributionItem, StudyStats } from "../types";
import { getStudyContributionData } from "../api/studyApi";
import { formatLocalYYYYMMDD } from "../data/mockStudyContribution";

/**
 * 학습 통계 데이터를 계산합니다.
 * @param items 365일 학습 기여 데이터
 */
export function calculateStudyStats(items: StudyContributionItem[]): StudyStats {
  const sortedItems = [...items].sort((a, b) => a.studyDate.localeCompare(b.studyDate));

  let totalMinutes = 0;
  let studiedDaysCount = 0;

  sortedItems.forEach((item) => {
    totalMinutes += item.studyMinutes;
    if (item.studyMinutes > 0) {
      studiedDaysCount++;
    }
  });

  let maxStreak = 0;
  let tempStreak = 0;

  sortedItems.forEach((item) => {
    if (item.studyMinutes > 0) {
      tempStreak++;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 0;
    }
  });
  maxStreak = Math.max(maxStreak, tempStreak);

  let currentStreak = 0;
  const todayStr = formatLocalYYYYMMDD(new Date());
  
  const todayIdx = sortedItems.findIndex((item) => item.studyDate === todayStr);
  const startIdx = todayIdx !== -1 ? todayIdx : sortedItems.length - 1;

  if (startIdx >= 0) {
    const todayItem = sortedItems[startIdx];
    const yesterdayItem = startIdx > 0 ? sortedItems[startIdx - 1] : null;

    const hasStudiedToday = todayItem && todayItem.studyMinutes > 0;
    const hasStudiedYesterday = yesterdayItem && yesterdayItem.studyMinutes > 0;

    if (hasStudiedToday || hasStudiedYesterday) {
      let checkIdx = hasStudiedToday ? startIdx : startIdx - 1;
      while (checkIdx >= 0) {
        if (sortedItems[checkIdx].studyMinutes > 0) {
          currentStreak++;
          checkIdx--;
        } else {
          break;
        }
      }
    }
  }

  return {
    totalMinutes,
    studiedDaysCount,
    currentStreak,
    maxStreak,
  };
}

/**
 * 분 단위를 "X시간 Y분" 문자열로 포맷팅합니다.
 */
export function formatMinutesToHoursAndMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}시간 ${mins}분`;
  }
  return `${mins}분`;
}

/**
 * 최근 365일 학습 잔디 데이터 및 결합 통계를 가져옵니다.
 */
export async function getStudyContributionSummary(): Promise<{
  items: StudyContributionItem[];
  stats: StudyStats;
}> {
  const today = new Date();
  const startDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 364, 0, 0, 0, 0);
  
  const startDate = formatLocalYYYYMMDD(startDateObj);
  const endDate = formatLocalYYYYMMDD(today);

  const items = await getStudyContributionData(startDate, endDate);
  const stats = calculateStudyStats(items);

  return {
    items,
    stats,
  };
}
