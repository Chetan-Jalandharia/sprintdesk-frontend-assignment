import type { TaskPriority, TaskStatus } from '../types'

type StatusBadgeProps =
  | { kind: 'status'; value: TaskStatus }
  | { kind: 'priority'; value: TaskPriority }

const labels: Record<TaskStatus | TaskPriority, string> = {
  backlog: 'Backlog',
  'in-progress': 'In progress',
  review: 'Review',
  done: 'Done',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function StatusBadge({ kind, value }: StatusBadgeProps) {
  return <span className={`badge badge-${kind}-${value}`}>{labels[value]}</span>
}
