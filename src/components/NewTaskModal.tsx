import { useState } from 'react'
import { useBoardStore, type NewTask } from '../stores/useBoardStore'
import type { TaskPriority, User } from '../types'

type NewTaskModalProps = {
  sprintId: number
  users: User[]
  onClose: () => void
}

export function NewTaskModal({ sprintId, users, onClose }: NewTaskModalProps) {
  const addTask = useBoardStore((state) => state.addTask)
  const [form, setForm] = useState<NewTask>({ title: '', description: '', priority: 'medium', assigneeId: users[0]?.id ?? 1, dueDate: '2026-08-28', sprintId })

  return <div className="modal-backdrop"><form className="task-modal" onSubmit={(event) => { event.preventDefault(); if (form.title.trim()) { addTask(form); onClose() } }}><div className="drawer-header"><div><p className="eyebrow">Sprint 3</p><h2>New task</h2></div><button className="close-button" type="button" onClick={onClose} aria-label="Close new task form">x</button></div><label htmlFor="new-task-title">Title<input id="new-task-title" autoFocus required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label htmlFor="new-task-description">Description<textarea id="new-task-description" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} /></label><div className="form-row"><label htmlFor="new-task-priority">Priority<select id="new-task-priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as TaskPriority })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label htmlFor="new-task-assignee">Assignee<select id="new-task-assignee" value={form.assigneeId} onChange={(event) => setForm({ ...form, assigneeId: Number(event.target.value) })}>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label></div><label htmlFor="new-task-due">Due date<input id="new-task-due" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></label><button className="primary-button" type="submit">Create task</button></form></div>
}
