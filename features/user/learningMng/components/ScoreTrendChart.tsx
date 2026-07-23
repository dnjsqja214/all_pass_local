import React, { useState } from "react";

export interface SubjectScorePoint {
  name: string;
  score: number;
  date?: string;
  roundTitle?: string;
  attemptTitle?: string;
}

export interface ChartHistoryPoint {
  label: string;
  subjects: SubjectScorePoint[];
}

interface ScoreTrendChartProps {
  historyData: ChartHistoryPoint[];
  title?: string;
  subtitle?: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  "중개사법령 및 실무": "#2E62D9", // Deep Blue
  "부동산공법": "#3F7D4E",          // Success Green
  "부동산세법": "#C93A35",          // Primary Red
};

const normalizeSubjectName = (name: string) => {
  if (name.includes("중개")) return "중개사법령 및 실무";
  if (name.includes("공법")) return "부동산공법";
  if (name.includes("세법")) return "부동산세법";
  return name;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return `${year}년 ${month}월 ${day}일`;
};

const getResultText = (score: number) => {
  if (score >= 60) return "합격 기준 이상";
  if (score < 40) return "과락";
  return "합격선 미만";
};

const getResultColor = (score: number) => {
  if (score >= 60) return "text-[#3F7D4E]";
  if (score < 40) return "text-[#D93D35]";
  return "text-[#817D76]";
};

interface TooltipState {
  subjectName: string;
  examTitle: string;
  attemptTitle: string;
  date: string;
  score: number;
  x: number;
  y: number;
}

export function ScoreTrendChart({
  historyData = [],
  title = "과목별 최근 성적 추이",
  subtitle = "최근 3회차별 과목별 점수 변동 내역",
}: ScoreTrendChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 400, height: 250 });
  const [hoveredPoint, setHoveredPoint] = useState<TooltipState | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions((prev) => {
        if (prev.width === width && prev.height === height) return prev;
        return { width, height };
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // 차트 마진 설정
  const margin = { top: 25, bottom: 35, left: 45, right: 80 };

  // Y coordinate mapping: score range [0, 100] -> [H - bottom, top]
  const getY = (score: number, H: number) => {
    const clamped = Math.max(0, Math.min(100, score));
    const graphHeight = H - margin.top - margin.bottom;
    return H - margin.bottom - (clamped / 100) * graphHeight;
  };

  // X coordinate mapping (using static total = 5)
  const getX = (index: number, total: number, W: number) => {
    const paddingLeft = 20;
    const paddingRight = 20;
    const startX = margin.left + paddingLeft;
    const endX = W - margin.right - paddingRight;

    if (total <= 1) return startX + (endX - startX) / 2;
    const graphWidth = endX - startX;
    const spacing = graphWidth / (total - 1);
    return startX + index * spacing;
  };

  const subjectsToDraw = ["중개사법령 및 실무", "부동산공법", "부동산세법"];

  // 1. Group records by subject
  const subjectHistoryMap: Record<string, Array<{
    score: number;
    date: string;
    roundTitle: string;
    attemptTitle: string;
  }>> = {};

  subjectsToDraw.forEach((subName) => {
    subjectHistoryMap[subName] = [];
  });

  (historyData || []).forEach((attempt) => {
    attempt.subjects?.forEach((s) => {
      const normName = normalizeSubjectName(s.name);
      if (subjectHistoryMap[normName]) {
        subjectHistoryMap[normName].push({
          score: s.score,
          date: s.date || "",
          roundTitle: s.roundTitle || "",
          attemptTitle: s.attemptTitle || "",
        });
      }
    });
  });

  // 2. Sort and select top 5 (and calculate line positions)
  const linesData = subjectsToDraw.map((subjectName) => {
    const rawHistory = subjectHistoryMap[subjectName] || [];

    // Sort descending by date (newest first)
    const sortedHistory = [...rawHistory].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Take top 5
    const top5 = sortedHistory.slice(0, 5);

    // Reverse to oldest first (so timeline goes left-to-right)
    const reversedTop5 = [...top5].reverse();

    // Map to 5-length array (padding nulls at the start)
    const paddedPoints = Array(5).fill(null);
    const startIndex = 5 - reversedTop5.length;
    for (let i = 0; i < reversedTop5.length; i++) {
      const data = reversedTop5[i];
      paddedPoints[startIndex + i] = {
        score: data.score,
        date: data.date,
        roundTitle: data.roundTitle,
        attemptTitle: data.attemptTitle,
        x: getX(startIndex + i, 5, dimensions.width),
        y: getY(data.score, dimensions.height),
      };
    }

    // Generate path only between non-null points
    let pathD = "";
    let isDrawing = false;
    paddedPoints.forEach((pt) => {
      if (pt !== null) {
        if (!isDrawing) {
          pathD += `M ${pt.x} ${pt.y}`;
          isDrawing = true;
        } else {
          pathD += ` L ${pt.x} ${pt.y}`;
        }
      } else {
        isDrawing = false;
      }
    });

    return {
      name: subjectName,
      color: SUBJECT_COLORS[subjectName] || "#817D76",
      points: paddedPoints,
      pathD,
    };
  });

  // Calculate average and pass/fail using each subject's most recent record
  const latestScores = subjectsToDraw.map((subjectName) => {
    const rawHistory = subjectHistoryMap[subjectName] || [];
    if (rawHistory.length === 0) return null;
    const sorted = [...rawHistory].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return sorted[0];
  });

  const validScores = latestScores.filter((s): s is NonNullable<typeof s> => s !== null);
  const totalScore = validScores.reduce((sum, s) => sum + s.score, 0);
  const averageScore = totalScore / (validScores.length || 1);
  const hasFail = validScores.some((s) => s.score < 40);
  const isPassed = averageScore >= 60 && !hasFail;

  // Encouragement text logic
  const getEncouragementText = () => {
    if (validScores.length === 0) return "응시 이력이 없습니다.";
    return (
      <span className="text-[13px] text-[#111111] font-medium leading-relaxed tracking-tight">
        최근 학습 결과 —{" "}
        <strong className="text-[#111111] font-semibold">
          평균 {averageScore.toFixed(1)}점
        </strong>
        {", "}
        {hasFail ? (
          <strong className="text-[#D93D35] font-semibold">과락 과목 존재</strong>
        ) : isPassed ? (
          <strong className="text-[#3F7D4E] font-semibold">합격선 통과 (합격 기준 충족)</strong>
        ) : (
          <strong className="text-[#817D76] font-semibold">합격선 미달 (평균 점수 미달)</strong>
        )}
      </span>
    );
  };

  const historyCount = historyData ? historyData.length : 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col gap-4 h-full min-h-0 flex-1 relative">
      {/* Title & Subtitle */}
      <div className="flex flex-col gap-1 border-b border-[#F6F4F0] pb-3">
        <h3 className="text-[17px] font-bold text-[#111111] tracking-tight">
          {title}
        </h3>
        <p className="text-[12px] text-[#817D76]">
          {subtitle}
        </p>
      </div>

      {/* Legends */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] font-semibold">
        {subjectsToDraw.map((subject) => (
          <div key={subject} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{ backgroundColor: SUBJECT_COLORS[subject] }}
            />
            <span className="text-[#111111]">{subject}</span>
          </div>
        ))}
      </div>

      {/* Optimized SVG Line Chart Area */}
      {historyCount > 0 ? (
        <div
          ref={containerRef}
          className="flex-1 w-full bg-[#F6F4F0]/30 rounded-xl p-0 flex justify-center items-center min-h-[150px] lg:min-h-[180px] relative overflow-hidden"
        >
          <svg
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="w-full h-full overflow-visible"
          >
            {/* Gridlines and Y-axis scores */}
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((score) => {
              const y = getY(score, dimensions.height);
              const isBoundary = score === 0 || score === 100;
              return (
                <g key={score}>
                  <line
                    x1={margin.left}
                    y1={y}
                    x2={dimensions.width - margin.right}
                    y2={y}
                    stroke="#E4E0D9"
                    strokeDasharray="3 3"
                    opacity={isBoundary ? "1" : "0.4"}
                  />
                  <text
                    x={margin.left - 10}
                    y={y + 4}
                    fill="#817D76"
                    fontSize="10"
                    textAnchor="end"
                  >
                    {score}
                  </text>
                </g>
              );
            })}

            {/* 과락 기준선 (40점) */}
            {(() => {
              const y40 = getY(40, dimensions.height);
              return (
                <g>
                  <line
                    x1={margin.left}
                    y1={y40}
                    x2={dimensions.width - margin.right}
                    y2={y40}
                    stroke="#D93D35"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={dimensions.width - margin.right + 5}
                    y={y40 + 3}
                    fill="#D93D35"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    과락선 (40점)
                  </text>
                </g>
              );
            })()}

            {/* 합격선 기준 (60점) */}
            {(() => {
              const y60 = getY(60, dimensions.height);
              return (
                <g>
                  <line
                    x1={margin.left}
                    y1={y60}
                    x2={dimensions.width - margin.right}
                    y2={y60}
                    stroke="#3F7D4E"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={dimensions.width - margin.right + 5}
                    y={y60 + 3}
                    fill="#3F7D4E"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    합격선 (60점)
                  </text>
                </g>
              );
            })()}

            {/* Chart Lines & Points */}
            {linesData.map((line) => (
              <g key={line.name}>
                {line.pathD && (
                  <path
                    d={line.pathD}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {line.points.map((pt, idx) => {
                  if (pt === null) return null;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredPoint({
                          subjectName: line.name,
                          examTitle: pt.roundTitle,
                          attemptTitle: pt.attemptTitle,
                          date: pt.date,
                          score: pt.score,
                          x: pt.x,
                          y: pt.y,
                        });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill={line.color}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      {/* Invisible larger hover target circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="12"
                        fill="transparent"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 9}
                        fill={line.color}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {pt.score}점
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}

            {/* X-axis Labels */}
            {["최근 5", "최근 4", "최근 3", "최근 2", "최신"].map((label, idx) => {
              const cx = getX(idx, 5, dimensions.width);
              return (
                <text
                  key={idx}
                  x={cx}
                  y={dimensions.height - 8}
                  fill="#817D76"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {label}
                </text>
              );
            })}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-10 bg-white border border-[#E4E0D9] rounded-xl p-3 shadow-md pointer-events-none flex flex-col gap-1 text-[11px] min-w-[130px] transition-all duration-150 ease-out"
              style={{
                left: hoveredPoint.x > dimensions.width / 2
                  ? `${hoveredPoint.x - 145}px`
                  : `${hoveredPoint.x + 15}px`,
                top: `${hoveredPoint.y}px`,
                transform: "translate(0, -50%)",
              }}
            >
              <div className="font-bold text-[#111111] border-b border-[#E4E0D9] pb-1 mb-1">
                {hoveredPoint.subjectName}
              </div>
              <div className="text-[#817D76] flex justify-between gap-2">
                <span>시험:</span>
                <span className="text-[#111111] font-semibold">
                  {hoveredPoint.examTitle} {hoveredPoint.attemptTitle}
                </span>
              </div>
              <div className="text-[#817D76] flex justify-between gap-2">
                <span>풀이일:</span>
                <span className="text-[#111111] font-semibold">
                  {formatDate(hoveredPoint.date)}
                </span>
              </div>
              <div className="text-[#817D76] flex justify-between gap-2">
                <span>점수:</span>
                <span className="text-[#111111] font-bold">
                  {hoveredPoint.score}점
                </span>
              </div>
              <div className="mt-1 pt-1 border-t border-[#F6F4F0] flex justify-between gap-2 font-semibold">
                <span className="text-[#817D76]">결과:</span>
                <span className={getResultColor(hoveredPoint.score)}>
                  {getResultText(hoveredPoint.score)}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[13px] text-[#817D76] font-medium">
          점수 기록이 없습니다.
        </div>
      )}

      {/* Encouragement text box at the bottom */}
      <div className="bg-[#F6F4F0] p-3 rounded-xl border border-[#E4E0D9] text-center mt-auto shrink-0">
        {getEncouragementText()}
      </div>
    </div>
  );
}
