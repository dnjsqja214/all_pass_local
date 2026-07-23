import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Member } from "../types/member";
import { mockMemberLearningDetails } from "../data/mockMemberLearningDetails";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { LearningSummaryCards } from "../../../learning/components/LearningSummaryCards";
import { ScoreTrendChart } from "../../../learning/components/ScoreTrendChart";
import { SubjectScoreList } from "../../../learning/components/SubjectScoreList";
import { PassingRuleCard } from "../../../learning/components/PassingRuleCard";
import { ExamHistoryList } from "../../../learning/components/ExamHistoryList";
import { WeakTopicList } from "../../../learning/components/WeakTopicList";
import styles from "./MemberDetailDialog.module.css";

interface MemberDetailDialogProps {
  member: Member | null;
  onClose: () => void;
}

export function MemberDetailDialog({ member, onClose }: MemberDetailDialogProps) {
  // 스크롤 방지 효과
  useEffect(() => {
    if (member) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [member]);

  if (!member) return null;

  const detail = mockMemberLearningDetails[member.id];

  return (
    <div className={styles.overlay}>
      {/* 백드롭 레이어 */}
      <div onClick={onClose} className={styles.backdrop} />

      {/* 다이얼로그 본체 */}
      <div className={styles.dialog}>
        {/* 상단 헤더 정보 영역 */}
        <header className={styles.header}>
          <div className={styles.headText}>
            <span className={styles.eyebrow}>ALLPASS STUDY OS</span>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>{member.name} 님의 학습 상세</h2>
              <MemberStatusBadge status={member.status} />
            </div>
            <div className={styles.metaRow}>
              <span>이메일: <strong>{member.email}</strong></span>
              <span className={styles.metaDivider}>|</span>
              <span>가입일: <strong>{member.joinedAt}</strong></span>
              <span className={styles.metaDivider}>|</span>
              <span>최근 접속: <strong>{member.lastLoginAt}</strong></span>
            </div>
          </div>
          <button onClick={onClose} aria-label="닫기" className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </header>

        {/* 바디 영역 (스크롤 가능) */}
        <div className={styles.body}>
          {detail ? (
            <>
              {/* 1. 학습 요약 분석 카드 */}
              <LearningSummaryCards
                studyMinutes={detail.totalStudyMinutes}
                examCount={detail.examCount}
                averageScore={detail.averageScore}
                wrongAnswerCount={detail.wrongAnswerCount}
              />

              {/* 2. 대시보드 2단 배치 */}
              <div className={styles.twoColumn}>
                <ScoreTrendChart
                  trendData={detail.scoreTrend}
                  title="시험 성적 추이"
                  subtitle="최근 응시한 시험의 총점 변화량"
                />
                <SubjectScoreList subjectScores={detail.subjectScores} />
              </div>

              <div className={styles.twoColumn}>
                <PassingRuleCard
                  totalScore={member.recentScore}
                  subjectScores={detail.subjectScores}
                />
                <WeakTopicList weakTopics={detail.weakTopics} />
              </div>

              {/* 3. 시험 이력 리스트 (아래 전체 너비) */}
              <div className={styles.historySection}>
                <ExamHistoryList history={detail.examHistory} />
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              선택한 회원의 학습 상세 데이터를 찾을 수 없습니다.
            </div>
          )}
        </div>

        {/* 하단 닫기 영역 (모바일용 고정 푸터 / 데스크톱에서도 유용) */}
        <footer className={styles.footer}>
          <button onClick={onClose} className={styles.closeTextButton}>
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
}
