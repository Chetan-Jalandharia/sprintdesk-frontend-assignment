import type { MockData, Task } from '../types'

export async function getMockData(): Promise<MockData> {
  const response = await fetch('/mock-data.json')

  if (!response.ok) {
    throw new Error('Unable to load SprintDesk data')
  }

  return response.json() as Promise<MockData>
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((first, second) => first.order - second.order)
}
