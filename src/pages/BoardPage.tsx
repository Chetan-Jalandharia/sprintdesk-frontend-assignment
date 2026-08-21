import { useEffect, useMemo, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { getMockData } from '../services/dataService'
import { useBoardStore } from '../stores/useBoardStore'
import type { Task, TaskPriority, TaskStatus } from '../types'
import { StatusBadge } from '../components/StatusBadge'
import { NewTaskModal } from '../components/NewTaskModal'

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'backlog', label: 'Backlog' },
  { status: 'in-progress', label: 'In progress' },
  { status: 'review', label: 'Review' },
  { status: 'done', label: 'Done' },
]

function SortableTask({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  return <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`task-card board-task ${isDragging ? 'task-dragging' : ''}`} {...attributes} {...listeners} onClick={onOpen} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onOpen() }} tabIndex={0}>
    <div className="task-card-topline"><StatusBadge kind="priority" value={task.priority} /><span className="task-id">SD-{String(task.id).padStart(3, '0')}</span></div><h3>{task.title}</h3><p>{task.description}</p><div className="task-card-footer"><span className="task-id">{task.dueDate}</span><span className="task-id">Drag to move</span></div>
  </article>
}

function DropColumn({ status, label, tasks, onOpen }: { status: TaskStatus; label: string; tasks: Task[]; onOpen: (taskId: number) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return <section ref={setNodeRef} className={`board-column board-drop-column ${isOver ? 'column-over' : ''}`}><div className="column-heading"><div><StatusBadge kind="status" value={status} /><span className="column-label">{label}</span></div><span className="column-count">{tasks.length}</span></div><SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}><div className="column-tasks">{tasks.map((task) => <SortableTask key={task.id} task={task} onOpen={() => onOpen(task.id)} />)}</div></SortableContext></section>
}

function TaskDrawer({ task, onClose, users }: { task: Task; onClose: () => void; users: { id: number; name: string }[] }) {
  const updateTask = useBoardStore((state) => state.updateTask)
  const addComment = useBoardStore((state) => state.addComment)
  const allComments = useBoardStore((state) => state.comments)
  const comments = useMemo(() => allComments.filter((comment) => comment.taskId === task.id), [allComments, task.id])
  const [draft, setDraft] = useState(task)
  const [comment, setComment] = useState('')
  function save() { updateTask(task.id, { title: draft.title, description: draft.description, priority: draft.priority, assigneeId: draft.assigneeId, dueDate: draft.dueDate }); onClose() }
  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><aside className="task-drawer" aria-label="Task details"><div className="drawer-header"><div><p className="eyebrow">Task details</p><h2>SD-{String(task.id).padStart(3, '0')}</h2></div><button className="close-button" type="button" onClick={onClose} aria-label="Close task details">x</button></div><div className="drawer-form"><label htmlFor="task-title">Title<input id="task-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label><label htmlFor="task-description">Description<textarea id="task-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={4} /></label><label htmlFor="task-priority">Priority<select id="task-priority" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as TaskPriority })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label htmlFor="task-assignee">Assignee<select id="task-assignee" value={draft.assigneeId} onChange={(event) => setDraft({ ...draft, assigneeId: Number(event.target.value) })}>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label><label htmlFor="task-due-date">Due date<input id="task-due-date" type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} /></label></div><div className="drawer-actions"><button className="primary-button" type="button" onClick={save}>Save changes</button><button className="text-button danger-button" type="button" onClick={() => { if (window.confirm('Delete this task?')) { useBoardStore.getState().deleteTask(task.id); onClose() } }}>Delete task</button></div><section className="comments"><h3>Comments <span>{comments.length}</span></h3>{comments.map((item) => <p key={item.id}><strong>Team member</strong>{item.message}</p>)}<form onSubmit={(event) => { event.preventDefault(); if (comment.trim()) { addComment(task.id, 1, comment.trim()); setComment('') } }}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a comment..." aria-label="Add a comment" /></form></section></aside></div>
}

export function BoardPage() {
  const { data, isPending, isError } = useQuery({ queryKey: ['mock-data'], queryFn: getMockData })
  const tasks = useBoardStore((state) => state.tasks)
  const setInitialData = useBoardStore((state) => state.setInitialData)
  const moveTask = useBoardStore((state) => state.moveTask)
  const setActiveTask = useBoardStore((state) => state.setActiveTask)
  const activeTaskId = useBoardStore((state) => state.activeTaskId)
  const [showNewTask, setShowNewTask] = useState(false)
  const [activeDrag, setActiveDrag] = useState<Task | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  useEffect(() => { if (data) setInitialData(data.tasks, data.comments) }, [data, setInitialData])
  const currentSprint = data?.sprints.at(-1)
  const sprintTasks = useMemo(() => tasks.filter((task) => task.sprintId === currentSprint?.id), [tasks, currentSprint?.id])
  const activeTask = tasks.find((task) => task.id === activeTaskId)
  if (isPending) return <div className="full-screen-state">Loading board...</div>
  if (isError || !data || !currentSprint) return <div className="state-panel">Could not load the board.</div>
  function handleDragEnd(event: DragEndEvent) { const overId = event.over?.id; const dragged = tasks.find((task) => task.id === event.active.id); if (!dragged || overId === undefined) return; const destination = columns.some((column) => column.status === overId) ? overId as TaskStatus : tasks.find((task) => task.id === overId)?.status ?? dragged.status; const destinationTasks = sprintTasks.filter((task) => task.status === destination && task.id !== dragged.id); const targetIndex = typeof overId === 'number' ? Math.max(0, destinationTasks.findIndex((task) => task.id === overId)) : destinationTasks.length; moveTask(dragged.id, destination, targetIndex + 1); setActiveDrag(null) }
  return <main className="workspace board-page"><section className="page-heading"><div><p className="eyebrow">{currentSprint.name} / {currentSprint.startDate} - {currentSprint.endDate}</p><h1>Sprint board</h1><p className="page-subtitle">Drag work between columns and keep the sprint moving.</p></div><button className="primary-button board-new-task" type="button" onClick={() => setShowNewTask(true)}>+ New task</button></section><DndContext sensors={sensors} onDragStart={(event) => setActiveDrag(tasks.find((task) => task.id === event.active.id) ?? null)} onDragCancel={() => setActiveDrag(null)} onDragEnd={handleDragEnd}><div className="board-grid full-board">{columns.map((column) => <DropColumn key={column.status} status={column.status} label={column.label} tasks={sprintTasks.filter((task) => task.status === column.status).sort((a, b) => a.order - b.order)} onOpen={setActiveTask} />)}</div><DragOverlay>{activeDrag ? <article className="task-card"><h3>{activeDrag.title}</h3></article> : null}</DragOverlay></DndContext>{activeTask && <TaskDrawer key={activeTask.id} task={activeTask} users={data.users} onClose={() => setActiveTask(null)} />}{showNewTask && <NewTaskModal sprintId={currentSprint.id} users={data.users} onClose={() => setShowNewTask(false)} />}</main>
}
