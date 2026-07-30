const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface WrongNoteQuestion {
  id: string;
  questionNumber: number;
  chapter: string | null;
  text: string;
  options: string[];
  selectedChoice: number | null;
  correctChoice: number;
  explanation: string | null;
  difficulty: number | null;
}

export interface WrongNoteReview {
  registrationId: string;
  examId: string;
  examTitle: string;
  score: number | null;
  totalQuestions: number;
  wrongCount: number;
  questions: WrongNoteQuestion[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || typeof value === "number";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isQuestion(value: unknown): value is WrongNoteQuestion {
  return isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.questionNumber === "number" &&
    isNullableString(value.chapter) &&
    typeof value.text === "string" &&
    Array.isArray(value.options) && value.options.every((option) => typeof option === "string") &&
    isNullableNumber(value.selectedChoice) &&
    typeof value.correctChoice === "number" &&
    isNullableString(value.explanation) &&
    isNullableNumber(value.difficulty);
}

function isReview(value: unknown): value is WrongNoteReview {
  return isRecord(value) &&
    typeof value.registrationId === "string" &&
    typeof value.examId === "string" &&
    typeof value.examTitle === "string" &&
    isNullableNumber(value.score) &&
    typeof value.totalQuestions === "number" &&
    typeof value.wrongCount === "number" &&
    Array.isArray(value.questions) && value.questions.every(isQuestion);
}

export async function getWrongNoteReview(
  registrationId: string,
  signal?: AbortSignal,
): Promise<WrongNoteReview> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/exam-registrations/${encodeURIComponent(registrationId)}/wrong-notes`,
    { credentials: "include", cache: "no-store", signal },
  );
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = isRecord(body) && typeof body.message === "string"
      ? body.message
      : `오답 노트를 불러오지 못했습니다. (${response.status})`;
    throw new Error(message);
  }
  if (!isRecord(body) || body.success !== true || !isReview(body.data)) {
    throw new Error("오답 노트 API 응답 형식이 올바르지 않습니다.");
  }
  return body.data;
}
