import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNotificationPosts } from '../services/notificationService'
import { useNotificationStore } from '../stores/useNotificationStore'
import { getMockData } from '../services/dataService'
import { useToastStore } from '../stores/useToastStore'

export function NotificationSync() {
  const seed = useNotificationStore((state) => state.seed)
  const addPosts = useNotificationStore((state) => state.addPosts)
  const panelOpen = useNotificationStore((state) => state.panelOpen)
  const addToast = useToastStore((state) => state.addToast)
  const { data: initialData } = useQuery({ queryKey: ['mock-data'], queryFn: getMockData })
  const { data: posts } = useQuery({ queryKey: ['notification-posts'], queryFn: getNotificationPosts, refetchInterval: 30000, refetchIntervalInBackground: false })
  useEffect(() => { if (initialData) seed(initialData.notifications) }, [initialData, seed])
  useEffect(() => { if (posts && !panelOpen) { const added = addPosts(posts); if (added > 0) addToast(`${added} new notification${added === 1 ? '' : 's'}`) } }, [posts, panelOpen, addPosts, addToast])
  return null
}
