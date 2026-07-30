"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, X, XCircle } from "lucide-react";
import { getWrongNoteReview, type WrongNoteReview } from "../../services/wrongNoteService";
import styles from "./WrongNoteModal.module.css";

interface WrongNoteModalProps {
  registrationId: string;
  onClose: () => void;
}

export function WrongNoteModal({ registrationId, onClose }: WrongNoteModalProps) {
  const [review, setReview] = useState<WrongNoteReview | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getWrongNoteReview(registrationId, controller.signal)
      .then(setReview)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "오답 노트를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [registrationId, reloadKey]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };
  const retry = () => {
    setIsLoading(true);
    setError(null);
    setReview(null);
    setActiveIndex(0);
    setReloadKey((value) => value + 1);
  };
  const question = review?.questions[activeIndex];

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={closeFromBackdrop}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wrong-note-title"
      >
        <header className={styles.header}>
          <div>
            <span>응시 결과 오답 노트</span>
            <h2 id="wrong-note-title">{review?.examTitle ?? "오답 노트"}</h2>
          </div>
          {review ? (
            <div className={styles.summary} aria-label="응시 결과 요약">
              <div><span>점수</span><strong>{review.score === null ? "-" : `${review.score}점`}</strong></div>
              <div><span>오답</span><strong>{review.wrongCount}개</strong></div>
              <div><span>전체</span><strong>{review.totalQuestions}개</strong></div>
            </div>
          ) : null}
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="오답 노트 닫기" autoFocus>
            <X />
          </button>
        </header>

        <div className={styles.content} aria-live="polite">
          {isLoading ? (
            <div className={styles.state}>실제 응시 결과를 불러오는 중입니다.</div>
          ) : error || !review ? (
            <div className={styles.state} data-error="true">
              <strong>오답 노트를 열 수 없습니다.</strong>
              <p>{error}</p>
              <button type="button" onClick={retry}>다시 시도</button>
            </div>
          ) : !question ? (
            <div className={styles.perfect}>
              <CheckCircle2 />
              <h3>틀린 문제가 없습니다.</h3>
              <p>이 시험의 모든 문항을 맞혔습니다.</p>
            </div>
          ) : (
            <div className={styles.reviewGrid}>
              <article className={styles.questionCard}>
                <div className={styles.questionMeta}>
                  <span>문제 {question.questionNumber}</span>
                  {question.chapter ? <em>{question.chapter}</em> : null}
                  {question.difficulty ? <small>난이도 {question.difficulty}</small> : null}
                </div>
                <h3>{question.text}</h3>
                <div className={styles.options}>
                  {question.options.map((option, index) => {
                    const choice = index + 1;
                    const isCorrect = choice === question.correctChoice;
                    const isSelected = choice === question.selectedChoice;
                    return (
                      <div key={choice} data-correct={isCorrect} data-selected={isSelected}>
                        <strong>{choice}</strong>
                        <span>{option}</span>
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
                <span>정답 해설</span>
                <p>{question.explanation?.trim() || "등록된 해설이 없습니다."}</p>
              </aside>
              <nav className={styles.pagination} aria-label="오답 문항 이동">
                <button type="button" disabled={activeIndex === 0} onClick={() => setActiveIndex((value) => value - 1)}>
                  <ChevronLeft /> 이전 문제
                </button>
                <span>{activeIndex + 1} / {review.questions.length}</span>
                <button
                  type="button"
                  disabled={activeIndex === review.questions.length - 1}
                  onClick={() => setActiveIndex((value) => value + 1)}
                >
                  다음 문제 <ChevronRight />
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
