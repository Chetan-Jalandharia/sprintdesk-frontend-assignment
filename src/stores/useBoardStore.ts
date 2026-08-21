import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment, Task, TaskStatus } from '../types'

const now = () => new Date().toISOString()

type NewTask = Pick<Task, 'title' | 'description' | 'priority' | 'assigneeId' | 'dueDate' | 'sprintId'>

type BoardState = {
  tasks: Task[]
  comments: Comment[]
  activeTaskId: number | null
  setInitialData: (tasks: Task[], comments: Comment[]) => void
  addTask: (task: NewTask) => void
  updateTask: (taskId: number, changes: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'assigneeId' | 'dueDate' | 'status'>>) => void
  moveTask: (taskId: number, status: TaskStatus, targetOrder?: number) => void
  deleteTask: (taskId: number) => void
  addComment: (taskId: number, authorId: number, message: string) => void
  setActiveTask: (taskId: number | null) => void
  getTasksByStatus: (status: TaskStatus, sprintId?: number) => Task[]
}

export const useBoardStore = create<BoardState>()(persist((set, get) => ({
  tasks: [], comments: [], activeTaskId: null,
  setInitialData: (tasks, comments) => { if (get().tasks.length === 0) set({ tasks, comments }) },
  addTask: (task) => set((state) => {
    const columnTasks = state.tasks.filter((item) => item.status === 'backlog' && item.sprintId === task.sprintId)
    const nextId = Math.max(0, ...state.tasks.map((item) => item.id)) + 1
    return { tasks: [...state.tasks, { ...task, id: nextId, status: 'backlog', order: columnTasks.length + 1, createdAt: now(), completedAt: null, updatedAt: now() }] }
  }),
  updateTask: (taskId, changes) => set((state) => ({ tasks: state.tasks.map((task) => task.id === taskId ? { ...task, ...changes, updatedAt: now(), completedAt: changes.status === 'done' ? task.completedAt ?? now() : task.completedAt } : task) })),
  moveTask: (taskId, status, targetOrder) => set((state) => {
    const moving = state.tasks.find((task) => task.id === taskId)
    if (!moving) return state
    const nextOrder = targetOrder ?? state.tasks.filter((task) => task.status === status && task.id !== taskId).length + 1
    const remaining = state.tasks.filter((task) => task.id !== taskId)
    const updated = remaining.map((task) => task.status === status && task.order >= nextOrder ? { ...task, order: task.order + 1 } : task)
    return { tasks: [...updated, { ...moving, status, order: nextOrder, updatedAt: now(), completedAt: status === 'done' ? moving.completedAt ?? now() : moving.completedAt }] }
  }),
  deleteTask: (taskId) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId), comments: state.comments.filter((comment) => comment.taskId !== taskId), activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId })),
  addComment: (taskId, authorId, message) => set((state) => ({ comments: [...state.comments, { id: Math.max(0, ...state.comments.map((comment) => comment.id)) + 1, taskId, authorId, message, createdAt: now() }] })),
  setActiveTask: (activeTaskId) => set({ activeTaskId }),
  getTasksByStatus: (status, sprintId) => get().tasks.filter((task) => task.status === status && (sprintId === undefined || task.sprintId === sprintId)).sort((first, second) => first.order - second.order),
}), { name: 'sprintdesk-board' }))

export type { NewTask }
