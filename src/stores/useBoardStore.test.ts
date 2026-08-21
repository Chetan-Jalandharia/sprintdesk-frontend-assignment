import { beforeEach, describe, expect, it } from 'vitest'
import { useBoardStore } from './useBoardStore'
import type { Task } from '../types'

const task: Task = { id: 1, title: 'Test task', description: 'Description', status: 'backlog', priority: 'medium', assigneeId: 1, dueDate: '2026-08-28', sprintId: 3, order: 1, createdAt: '2026-08-21T00:00:00Z', completedAt: null, updatedAt: '2026-08-21T00:00:00Z' }

describe('board store', () => {
  beforeEach(() => { useBoardStore.setState({ tasks: [task], comments: [], activeTaskId: null }) })
  it('adds a task', () => { useBoardStore.getState().addTask({ title: 'New', description: 'New description', priority: 'low', assigneeId: 1, dueDate: '2026-08-28', sprintId: 3 }); expect(useBoardStore.getState().tasks).toHaveLength(2) })
  it('moves a task between columns', () => { useBoardStore.getState().moveTask(1, 'done'); expect(useBoardStore.getState().tasks[0].status).toBe('done') })
  it('deletes a task', () => { useBoardStore.getState().deleteTask(1); expect(useBoardStore.getState().tasks).toHaveLength(0) })
})
