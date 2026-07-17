import React from "react";
import { RiskMember } from "../hooks/adminData";
import cardStyles from "./AdminCard.module.css";
import styles from "./RiskMemberList.module.css";

interface RiskMemberListProps {
  members: RiskMember[];
}

export function RiskMemberList({ members }: RiskMemberListProps) {
  // 경고 배지 스타일 매핑
  const badgeStyles = (type: string) => {
    switch (type) {
      case "과락 위험":
        return styles.badgeFailRisk;
      case "미제출":
        return styles.badgeUnsubmitted;
      case "반복 오답":
        return styles.badgeWrongRepeat;
      default:
        return styles.badgeDefault;
    }
  };

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.header}>
        <h4 className={cardStyles.title}>
          위험군 — 오늘 관리 필요
        </h4>
        <p className={cardStyles.subtitle}>
          점수 하락 또는 미제출 등으로 알림이 감지된 학습자입니다.
        </p>
      </div>

      <div className={styles.listWrapper}>
        {members.map((member) => (
          <div key={member.id} className={styles.rowItem}>
            <div className={styles.infoWrapper}>
              <span className={`${styles.badgeBase} ${badgeStyles(member.type)}`}>
                {member.type}
              </span>
              
              <div className={styles.textWrapper}>
                <span className={styles.memberName}>
                  {member.name}
                </span>
                <span className={styles.reason}>
                  {member.reason}
                </span>
              </div>
            </div>

            <button
              onClick={() => alert(`${member.name}님에게 ${member.actionText} 처리를 시도합니다.`)}
              className={styles.actionButton}
            >
              {member.actionText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

