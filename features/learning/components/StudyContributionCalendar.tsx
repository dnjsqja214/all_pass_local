"use client";

import React, { useEffect, useRef, useState } from "react";
import { StudyContributionItem, StudyStats } from "../types";
import { getStudyContributionSummary } from "../services/studyService";
import { StudyContributionTooltip } from "./StudyContributionTooltip";
import { StudyDayDetailModal } from "./StudyDayDetailModal";
import styles from "./StudyContributionCalendar.module.css";

const DISPLAY_WEEKDAYS = ["", "월", "", "수", "", "금", ""];

export function StudyContributionCalendar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<StudyContributionItem[]>([]);
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [hoveredItem, setHoveredItem] = useState<StudyContributionItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [selectedItem, setSelectedItem] = useState<StudyContributionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getStudyContributionSummary()
      .then((res) => {
        if (!active) return;
        setData(res.items);
        setStats(res.stats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("학습 잔디 데이터 로드 실패:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && scrollWrapperRef.current) {
      const el = scrollWrapperRef.current;
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    }
  }, [loading]);

  if (loading || !stats) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>학습 기록을 불러오는 중...</span>
      </div>
    );
  }

  const today = new Date();

  const buildCalendarGrid = (): StudyContributionItem[][] => {
    const startDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 364, 0, 0, 0, 0);
    const startDayOfWeek = startDateObj.getDay();
    const calendarStart = new Date(startDateObj);
    calendarStart.setDate(calendarStart.getDate() - startDayOfWeek);

    const calendarEnd = new Date(today);
    calendarEnd.setDate(calendarEnd.getDate() + (6 - today.getDay()));

    const itemsMap = new Map<string, StudyContributionItem>();
    data.forEach((item) => {
      itemsMap.set(item.studyDate, item);
    });

    const weeks: StudyContributionItem[][] = [];
    let currentWeek: StudyContributionItem[] = [];

    const cursor = new Date(calendarStart);
    while (cursor <= calendarEnd) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, "0");
      const d = String(cursor.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;

      let item = itemsMap.get(dateStr);
      if (!item) {
        item = {
          studyDate: dateStr,
          studyMinutes: 0,
          questionCount: 0,
          subjects: [],
        };
      }

      currentWeek.push(item);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    return weeks;
  };

  const weeksGrid = buildCalendarGrid();

  const getMonthLabels = (): { label: string; colIdx: number }[] => {
    const labels: { label: string; colIdx: number }[] = [];
    let lastMonth = -1;

    weeksGrid.forEach((week, colIdx) => {
      const firstDay = week[0];
      const parts = firstDay.studyDate.split("-");
      if (parts.length === 3) {
        const month = parseInt(parts[1], 10);
        if (month !== lastMonth) {
          if (labels.length === 0 || colIdx - labels[labels.length - 1].colIdx >= 3) {
            labels.push({
              label: `${month}월`,
              colIdx,
            });
            lastMonth = month;
          }
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  const getStageClass = (minutes: number, isFuture: boolean): string => {
    if (isFuture) return styles.stageFuture;
    if (minutes <= 0) return styles.stage0;
    if (minutes < 30) return styles.stage1;
    if (minutes < 60) return styles.stage2;
    if (minutes < 120) return styles.stage3;
    return styles.stage4;
  };

  const handleCellMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: StudyContributionItem) => {
    const cellDate = new Date(item.studyDate);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    if (cellDate > todayMidnight) return;

    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = containerRef.current.getBoundingClientRect();

    const x = rect.left - parentRect.left + rect.width / 2;
    const y = rect.top - parentRect.top;

    setHoveredItem(item);
    setTooltipPos({ x, y });
    setTooltipVisible(true);
  };

  const handleCellMouseLeave = () => {
    setTooltipVisible(false);
    setHoveredItem(null);
    setTooltipPos(null);
  };

  const handleCellClick = (item: StudyContributionItem) => {
    const cellDate = new Date(item.studyDate);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    if (cellDate > todayMidnight) return;

    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.header}>
        <h3 className={styles.title}>학습 잔디</h3>
        <p className={styles.subtitle}>최근 1년간의 공부 기록을 확인해 보세요.</p>
      </div>

      <div className={styles.calendarCard}>
        <div className={styles.scrollWrapper} ref={scrollWrapperRef}>
          <div className={styles.gridContainer}>

            <div className={styles.monthsRow}>
              {monthLabels.map((m, idx) => (
                <span
                  key={idx}
                  className={styles.monthLabel}
                  style={{ left: `${m.colIdx * 15 + 32}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className={styles.gridBody}>
              <div className={styles.weekdaysCol}>
                {DISPLAY_WEEKDAYS.map((day, idx) => (
                  <span key={idx} className={styles.weekdayLabel}>
                    {day}
                  </span>
                ))}
              </div>

              <div className={styles.weeksGrid}>
                {weeksGrid.map((week, colIdx) => (
                  <div key={colIdx} className={styles.weekColumn}>
                    {week.map((day) => {
                      const cellDate = new Date(day.studyDate);
                      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
                      const isFuture = cellDate > todayMidnight;

                      return (
                        <div
                          key={day.studyDate}
                          className={`${styles.cell} ${getStageClass(day.studyMinutes, isFuture)}`}
                          onMouseEnter={(e) => handleCellMouseEnter(e, day)}
                          onMouseLeave={handleCellMouseLeave}
                          onClick={() => handleCellClick(day)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        <div className={styles.legendContainer}>
          <span className={styles.legendText}>적음</span>
          <div className={styles.legendStage0} />
          <div className={styles.legendStage1} />
          <div className={styles.legendStage2} />
          <div className={styles.legendStage3} />
          <div className={styles.legendStage4} />
          <span className={styles.legendText}>많음</span>
        </div>

      </div>

      {hoveredItem && (
        <StudyContributionTooltip
          studyDate={hoveredItem.studyDate}
          studyMinutes={hoveredItem.studyMinutes}
          questionCount={hoveredItem.questionCount}
          position={tooltipPos}
          visible={tooltipVisible}
        />
      )}

      <StudyDayDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
    </div>
  );
}
