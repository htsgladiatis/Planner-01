export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Day {
  name: string;
  date: string;
  tasks: Task[];
  color: string;
}

export type PlannerData = Day[];

export interface DraggedItem {
  task: Task;
  fromDayIndex: number;
  fromTaskIndex: number;
}
