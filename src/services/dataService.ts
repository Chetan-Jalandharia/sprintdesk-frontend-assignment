import type { MockData, Task } from '../types'
import bundledMockData from '../../mock-data.json'

export async function getMockData(): Promise<MockData> {
  if (import.meta.env.PROD) return bundledMockData as MockData

  try {
    const response = await fetch('/mock-data.json')

    if (response.ok) return response.json() as Promise<MockData>
  } catch {}

  return bundledMockData as MockData
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((first, second) => first.order - second.order)
}
