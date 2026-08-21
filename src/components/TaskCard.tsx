import type { Task, User } from '../types'
import { StatusBadge } from './StatusBadge'

type TaskCardProps = {
  task: Task
  assignee?: User
}

export function TaskCard({ task, assignee }: TaskCardProps) {
  return (
    <article className="task-card">
      <div className="task-card-topline">
        <StatusBadge kind="priority" value={task.priority} />
        <span className="task-id">SD-{String(task.id).padStart(3, '0')}</span>
      </div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-card-footer">
        <div className="assignee">
          <img src={assignee?.avatar} alt="" />
          <span>{assignee?.name.split(' ')[0] ?? 'Unassigned'}</span>
        </div>
        <time dateTime={task.dueDate}>Due {task.dueDate.slice(5).replace('-', '/')}</time>
      </div>
    </article>
  )
}
