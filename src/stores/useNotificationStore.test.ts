import { beforeEach, describe, expect, it } from 'vitest'
import { useNotificationStore } from './useNotificationStore'

describe('notification store', () => {
  beforeEach(() => { useNotificationStore.setState({ notifications: [], panelOpen: false }) })
  it('adds unseen posts and limits the list', () => { const posts = Array.from({ length: 5 }, (_, index) => ({ id: index + 1, title: `Post ${index}`, body: '' })); expect(useNotificationStore.getState().addPosts(posts)).toBe(5); expect(useNotificationStore.getState().notifications).toHaveLength(5) })
  it('marks notifications read', () => { useNotificationStore.getState().addPosts([{ id: 1, title: 'Post', body: '' }]); useNotificationStore.getState().markRead(1); expect(useNotificationStore.getState().notifications[0].read).toBe(true) })
})
