import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '../types'
import type { RemotePost } from '../services/notificationService'

type NotificationState = {
  notifications: Notification[]
  panelOpen: boolean
  seed: (notifications: Notification[]) => void
  addPosts: (posts: RemotePost[]) => number
  markRead: (id: number) => void
  markAllRead: () => void
  setPanelOpen: (open: boolean) => void
}

export const useNotificationStore = create<NotificationState>()(persist((set, get) => ({
  notifications: [], panelOpen: false,
  seed: (notifications) => { if (get().notifications.length === 0) set({ notifications }) },
  addPosts: (posts) => {
    const existing = new Set(get().notifications.map((notification) => notification.id))
    const newNotifications = posts.filter((post) => !existing.has(post.id)).map((post) => ({ id: post.id, title: 'New update', message: post.title, type: 'task' as const, read: false, createdAt: new Date().toISOString() }))
    if (newNotifications.length) set((state) => ({ notifications: [...newNotifications, ...state.notifications].slice(0, 100) }))
    return newNotifications.length
  },
  markRead: (id) => set((state) => ({ notifications: state.notifications.map((notification) => notification.id === id ? { ...notification, read: true } : notification) })),
  markAllRead: () => set((state) => ({ notifications: state.notifications.map((notification) => ({ ...notification, read: true })) })),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
}), { name: 'sprintdesk-notifications' }))
