import { mockExams } from "../data/mockExams";

export interface ExamRegistration {
  id: string;
  examId: string;
  examTitle: string;
  year: number;
  round: number;
  subject: string;
  registrationDate: string; // Target exam date (YYYY-MM-DD)
  status: "applied" | "cancelled" | "completed";
  appliedAt: string;
}

const STORAGE_KEY = "allpass-exam-registrations";

export const examRegistrationService = {
  /**
   * 신청 정보 목록 조회
   */
  getRegistrations(): ExamRegistration[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as ExamRegistration[];
    } catch (error) {
      console.error("Failed to retrieve registrations from localStorage", error);
      return [];
    }
  },

  /**
   * 시험 신청 등록
   */
  async registerExam(examId: string, registrationDate: string): Promise<ExamRegistration> {
    if (typeof window === "undefined") {
      throw new Error("Cannot run registration in non-browser environment");
    }
    
    // mockExams에서 시험 정보 찾기
    const exam = mockExams.find((e) => e.id === examId);
    if (!exam) {
      throw new Error("존재하지 않는 시험입니다.");
    }

    try {
      const current = this.getRegistrations();
      
      const newRegistration: ExamRegistration = {
        id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        examId: exam.id,
        examTitle: exam.title,
        year: exam.year,
        round: exam.round,
        subject: exam.subject,
        registrationDate,
        status: "applied",
        appliedAt: new Date().toISOString(),
      };

      const updated = [newRegistration, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return newRegistration;
    } catch (error) {
      console.error("Failed to save exam registration", error);
      throw new Error("시험 신청을 저장하는 중 오류가 발생했습니다.");
    }
  },

  /**
   * 시험 신청 취소
   */
  cancelRegistration(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getRegistrations();
      const updated = current.map((reg) => 
        reg.id === id ? { ...reg, status: "cancelled" as const } : reg
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to cancel registration", error);
    }
  }
};
