"use client";

import { useState } from "react";

interface UseKanbanDragAndDropProps {
  onTaskMove?: (
    taskId: string,
    targetColumnId: string,
    newOrder: number
  ) => void;
}

export function useKanbanDragAndDrop({
  onTaskMove,
}: UseKanbanDragAndDropProps = {}) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState<string | null>(
    null
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";

    // Add a slight delay for ghost image styling
    const target = e.currentTarget;
    setTimeout(() => {
      target.classList.add("opacity-40", "rotate-2", "scale-[0.98]");
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedTaskId(null);
    setDraggedOverColumnId(null);
    const target = e.currentTarget;
    target.classList.remove("opacity-40", "rotate-2", "scale-[0.98]");
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedOverColumnId !== columnId) {
      setDraggedOverColumnId(columnId);
    }
  };

  const handleDragLeave = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => {
    if (draggedOverColumnId === columnId) {
      setDraggedOverColumnId(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumnId: string
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDraggedTaskId(null);
    setDraggedOverColumnId(null);

    if (taskId && onTaskMove) {
      onTaskMove(taskId, targetColumnId, 1);
    }
  };

  return {
    draggedTaskId,
    draggedOverColumnId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
