export {};

declare global {
  type TaskPriority = "low" | "medium" | "high" | "urgent";

  interface UserProfile {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: "admin" | "member";
  }

  interface SubtaskItem {
    _id: string;
    taskId: string;
    title: string;
    isCompleted: boolean;
    order: number;
  }

  interface TaskComment {
    _id: string;
    taskId: string;
    authorId: string;
    author?: UserProfile;
    content: string;
    createdAt: number;
  }

  interface KanbanTask {
    _id: string;
    boardId: string;
    columnId: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    status: string;
    assigneeIds: string[];
    assignees?: UserProfile[];
    tags: string[];
    dueDate?: number;
    order: number;
    coverColor?: string;
    estimatedHours?: number;
    loggedHours?: number;
    subtaskCount?: number;
    completedSubtaskCount?: number;
    commentCount?: number;
    isArchived: boolean;
    createdAt: number;
    updatedAt: number;
  }

  interface KanbanColumnData {
    _id: string;
    boardId: string;
    name: string;
    color: string;
    wipLimit?: number;
    order: number;
    tasks?: KanbanTask[];
    createdAt: number;
  }

  interface KanbanBoardData {
    _id: string;
    workspaceId: string;
    name: string;
    description?: string;
    icon: string;
    accentColor: string;
    isArchived: boolean;
    order: number;
    columns?: KanbanColumnData[];
    createdAt: number;
  }

  interface KanbanBoardProps {
    initialBoard?: KanbanBoardData;
    onAddTask?: (columnId?: string) => void;
    onAddColumn?: () => void;
  }

  interface TaskUpdate {
    sn: number;
    project: string;
    taskName: string;
    assignedOn: string;
    assignedBy: {
      name: string;
      avatarBg: string;
    };
    dueDate: string;
    status: "Inprogress" | "Done" | "Pending";
  }

  interface AssetGroup {
    id: string;
    name: string;
    count: number;
    iconBg: string;
    iconText: string;
    iconLabel: string;
    sharedAvatars: string[];
  }

  interface CalendarDay {
    day: string;
    date: number;
  }

  interface ScheduleEvent {
    id: string;
    time: string;
    title: string;
    subtitle: string;
    bgColor: string;
  }
}
