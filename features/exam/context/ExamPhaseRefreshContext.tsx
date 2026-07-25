"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

interface ExamPhaseRefreshContextValue {
  refreshRegistrations: () => Promise<void>;
}

const ExamPhaseRefreshContext = createContext<ExamPhaseRefreshContextValue | null>(null);

export function ExamPhaseRefreshProvider({
  refreshRegistrations,
  children,
}: ExamPhaseRefreshContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ refreshRegistrations }), [refreshRegistrations]);

  return (
    <ExamPhaseRefreshContext.Provider value={value}>
      {children}
    </ExamPhaseRefreshContext.Provider>
  );
}

export function useExamPhaseRefresh(): ExamPhaseRefreshContextValue {
  const context = useContext(ExamPhaseRefreshContext);
  if (!context) {
    throw new Error("useExamPhaseRefresh는 ExamPhaseRefreshProvider 안에서 사용해야 합니다.");
  }
  return context;
}
