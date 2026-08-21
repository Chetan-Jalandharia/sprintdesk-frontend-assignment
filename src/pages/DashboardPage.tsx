import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMockData } from '../services/dataService'
import type { TaskStatus } from '../types'
import { StatusBadge } from '../components/StatusBadge'
import { TaskCard } from '../components/TaskCard'
import { NewTaskModal } from '../components/NewTaskModal'

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'backlog', label: 'Backlog' },
  { status: 'in-progress', label: 'In progress' },
  { status: 'review', label: 'Review' },
  { status: 'done', label: 'Done' },
]

export function DashboardPage() {
  const [showNewTask, setShowNewTask] = useState(false)
  const { data, isPending, isError } = useQuery({
    queryKey: ['mock-data'],
    queryFn: getMockData,
  })

  if (isPending) return <div className="state-panel">Loading your workspace...</div>
  if (isError || !data) return <div className="state-panel">Could not load the workspace.</div>

  const currentSprint = data.sprints.at(-1)
  const sprintTasks = data.tasks.filter((task) => task.sprintId === currentSprint?.id)
  const completed = sprintTasks.filter((task) => task.status === 'done').length
  const completion = sprintTasks.length ? Math.round((completed / sprintTasks.length) * 100) : 0

  return (
    <main className="workspace">
      <section className="page-heading">
        <div>
          <p className="eyebrow">{currentSprint?.name} / active sprint</p>
          <h1>Good morning, Emily.</h1>
          <p className="page-subtitle">Here is what your team is moving forward today.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setShowNewTask(true)}>+ New task</button>
      </section>

      <section className="metrics" aria-label="Sprint summary">
        <div className="metric-card metric-highlight">
          <span>Sprint progress</span>
          <strong>{completion}%</strong>
          <div className="progress-track"><span style={{ width: `${completion}%` }} /></div>
          <small>{completed} of {sprintTasks.length} tasks complete</small>
        </div>
        <div className="metric-card"><span>Open tasks</span><strong>{sprintTasks.length - completed}</strong><small>Across three active columns</small></div>
        <div className="metric-card"><span>Due this week</span><strong>{sprintTasks.filter((task) => task.dueDate <= '2026-08-24').length}</strong><small>Keep the momentum steady</small></div>
        <div className="metric-card"><span>Team members</span><strong>{data.users.length}</strong><small>Working on this sprint</small></div>
      </section>

      <section className="board-preview">
        <div className="section-heading"><div><p className="eyebrow">Team workspace</p><h2>Current sprint board</h2></div><a className="text-button" href="/board">Open full board <span aria-hidden="true">→</span></a></div>
        <div className="board-grid">
          {columns.map((column) => {
            const tasks = sprintTasks.filter((task) => task.status === column.status).sort((a, b) => a.order - b.order).slice(0, 2)
            return <div className="board-column" key={column.status}><div className="column-heading"><div><StatusBadge kind="status" value={column.status} /><span className="column-label">{column.label}</span></div><span className="column-count">{sprintTasks.filter((task) => task.status === column.status).length}</span></div>{tasks.map((task) => <TaskCard key={task.id} task={task} assignee={data.users.find((user) => user.id === task.assigneeId)} />)}</div>
          })}
        </div>
      </section>
      {showNewTask && currentSprint && <NewTaskModal sprintId={currentSprint.id} users={data.users} onClose={() => setShowNewTask(false)} />}
    </main>
  )
}
