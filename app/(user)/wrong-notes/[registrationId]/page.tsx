"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { getWrongNoteReview, type WrongNoteReview } from "../../../../features/exam/services/wrongNoteService";
import styles from "../page.module.css";

export default function WrongNotePage() {
  const { registrationId } = useParams<{ registrationId: string }>();
  const router = useRouter();
  const [review, setReview] = useState<WrongNoteReview | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getWrongNoteReview(registrationId, controller.signal)
      .then((data) => {
        setReview(data);
        setActiveIndex(0);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "오답 노트를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [registrationId]);

  const goBack = () => router.push("/exam-registration");

  if (isLoading) {
    return <section className={styles.state}>실제 응시 결과를 불러오는 중입니다.</section>;
  }
  if (error || !review) {
    return (
      <section className={styles.state} data-error="true">
        <strong>오답 노트를 열 수 없습니다.</strong>
        <p>{error}</p>
        <button type="button" onClick={goBack}>시험 신청 목록으로</button>
      </section>
    );
  }

  const question = review.questions[activeIndex];
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backButton} onClick={goBack}>
          <ArrowLeft /> 시험 신청 목록
        </button>
        <div><span>응시 결과 오답 노트</span><h1>{review.examTitle}</h1></div>
        <div className={styles.summary}>
          <div><span>점수</span><strong>{review.score === null ? "-" : `${review.score}점`}</strong></div>
          <div><span>오답</span><strong>{review.wrongCount}개</strong></div>
          <div><span>전체</span><strong>{review.totalQuestions}개</strong></div>
        </div>
      </header>

      {!question ? (
        <div className={styles.perfect}>
          <CheckCircle2 /><h2>틀린 문제가 없습니다.</h2><p>이 시험의 모든 문항을 맞혔습니다.</p>
          <button type="button" onClick={goBack}>시험 신청 목록으로</button>
        </div>
      ) : (
        <div className={styles.reviewGrid}>
          <article className={styles.questionCard}>
            <div className={styles.questionMeta}>
              <span>문제 {question.questionNumber}</span>
              {question.chapter ? <em>{question.chapter}</em> : null}
              {question.difficulty ? <small>난이도 {question.difficulty}</small> : null}
            </div>
            <h2>{question.text}</h2>
            <div className={styles.options}>
              {question.options.map((option, index) => {
                const choice = index + 1;
                const isCorrect = choice === question.correctChoice;
                const isSelected = choice === question.selectedChoice;
                return (
                  <div key={choice} data-correct={isCorrect} data-selected={isSelected}>
                    <strong>{choice}</strong><span>{option}</span>
                    {isCorrect ? <em><CheckCircle2 /> 정답</em> : null}
                    {isSelected && !isCorrect ? <em><XCircle /> 내 답</em> : null}
                  </div>
                );
              })}
            </div>
            <div className={styles.answerSummary}>
              <span>내 답 <strong>{question.selectedChoice ?? "미응답"}</strong></span>
              <span>정답 <strong>{question.correctChoice}</strong></span>
            </div>
          </article>
          <aside className={styles.explanationCard}>
            <span>정답 해설</span><p>{question.explanation?.trim() || "등록된 해설이 없습니다."}</p>
          </aside>
          <nav className={styles.pagination} aria-label="오답 문항 이동">
            <button type="button" disabled={activeIndex === 0} onClick={() => setActiveIndex((value) => value - 1)}>
              <ChevronLeft /> 이전 문제
            </button>
            <span>{activeIndex + 1} / {review.questions.length}</span>
            <button type="button" disabled={activeIndex === review.questions.length - 1} onClick={() => setActiveIndex((value) => value + 1)}>
              다음 문제 <ChevronRight />
            </button>
          </nav>
        </div>
      )}
    </section>
  );
}
