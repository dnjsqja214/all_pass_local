import { StudyContributionItem } from "../types";
import { mockStudyContributionData } from "../data/mockStudyContribution";

/**
 * 날짜 범위(startDate ~ endDate)에 해당하는 학습 기록 데이터를 가져옵니다.
 * @param startDate 시작일 (YYYY-MM-DD)
 * @param endDate 종료일 (YYYY-MM-DD)
 */
export async function getStudyContributionData(
  startDate: string,
  endDate: string
): Promise<StudyContributionItem[]> {
  return new Promise((resolve) => {
    const filtered = mockStudyContributionData.filter(
      (item) => item.studyDate >= startDate && item.studyDate <= endDate
    );
    resolve(filtered);
  });
}

/**
 * 특정 날짜의 상세 학습 기록을 가져옵니다.
 * @param studyDate 조회할 날짜 (YYYY-MM-DD)
 */
export async function getStudyDetailByDate(
  studyDate: string
): Promise<StudyContributionItem | null> {
  return new Promise((resolve) => {
    const found = mockStudyContributionData.find((item) => item.studyDate === studyDate);
    resolve(found || null);
  });
}
