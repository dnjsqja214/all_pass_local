import React from "react";
import { TodoItem } from "../hooks/useDashboardData";

interface TodoItemCardProps {
  todo: TodoItem;
}

export function TodoItemCard({ todo }: TodoItemCardProps) {
  // 상태에 따른 배지 스타일 지정
  const statusStyles = {
    wait: {
      bg: "bg-[#F1F0EC]",
      text: "text-[#757470]",
    },
    delayed: {
      bg: "bg-[#FDF1F0]",
      text: "text-[#B83A38]",
    },
    completed: {
      bg: "bg-[#E6F4EA]",
      text: "text-[#137333]",
    },
  };

  const style = statusStyles[todo.status] || statusStyles.wait;

  return (
    <div className="w-full bg-white rounded-[24px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#EDEDED] flex justify-between items-center transition-all hover:scale-[1.01]">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-tight">
          {todo.title}
        </h3>
        <p className="text-[13px] text-[#8E8E8E] font-medium tracking-tight">
          {todo.subtitle}
        </p>
      </div>
      <span
        className={`${style.bg} ${style.text} text-[13px] font-bold px-3.5 py-1.5 rounded-full`}
      >
        {todo.statusText}
      </span>
    </div>
  );
}
