import React from "react";
import { SeatStatus } from "../hooks/adminData";
import cardStyles from "./AdminCard.module.css";
import styles from "./AttendanceSeatGrid.module.css";

interface AttendanceSeatGridProps {
  seats: SeatStatus[];
}

export function AttendanceSeatGrid({ seats }: AttendanceSeatGridProps) {
  // 상태별 클래스 매핑
  const seatStyles = {
    normal: styles.seatNormal,
    late: styles.seatLate,
    absent: styles.seatAbsent,
  };

  const legendDots = {
    normal: `${styles.legendDot} ${styles.legendDotNormal}`,
    late: `${styles.legendDot} ${styles.legendDotLate}`,
    absent: `${styles.legendDot} ${styles.legendDotAbsent}`,
  };

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.header}>
        <h4 className={cardStyles.title}>
          실시간 출결
        </h4>
        <p className={cardStyles.subtitle}>
          오프라인 지정좌석 16석 + 온라인
        </p>
      </div>

      {/* 16개 지정 좌석 배치도 (모바일은 8열, 데스크톱 등은 4열) */}
      <div className={styles.grid}>
        {seats.map((seat) => (
          <div
            key={seat.seatNumber}
            className={`${styles.seat} ${seatStyles[seat.status]}`}
          >
            <span className={styles.seatNumber}>#{seat.seatNumber}</span>
            <span className={styles.seatStatus}>
              {seat.status === "normal" && "정상"}
              {seat.status === "late" && "지각"}
              {seat.status === "absent" && "결석"}
            </span>
          </div>
        ))}
      </div>

      {/* 출결 범례 */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={legendDots.normal} />
          <span>정상</span>
        </div>
        <div className={styles.legendItem}>
          <div className={legendDots.late} />
          <span>지각</span>
        </div>
        <div className={styles.legendItem}>
          <div className={legendDots.absent} />
          <span>결석</span>
        </div>
      </div>
    </div>
  );
}

