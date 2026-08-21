import { useState } from 'react'
import { useNotificationStore } from '../stores/useNotificationStore'

export function NotificationPanel() {
  const notifications = useNotificationStore((state) => state.notifications)
  const markRead = useNotificationStore((state) => state.markRead)
  const markAllRead = useNotificationStore((state) => state.markAllRead)
  const panelOpen = useNotificationStore((state) => state.panelOpen)
  const setPanelOpen = useNotificationStore((state) => state.setPanelOpen)
  const [page, setPage] = useState(0)
  const unreadCount = notifications.filter((notification) => !notification.read).length
  const pageSize = 20
  const pageCount = Math.max(1, Math.ceil(notifications.length / pageSize))
  const visibleNotifications = notifications.slice(page * pageSize, (page + 1) * pageSize)

  return <div className="notification-area"><button className="icon-button notification" type="button" aria-label={`Notifications, ${unreadCount} unread`} onClick={() => { setPage(0); setPanelOpen(!panelOpen) }}>♧{unreadCount > 0 && <i />}</button>{panelOpen && <aside className="notification-panel" aria-label="Notifications"><div className="notification-panel-header"><div><strong>Notifications</strong><small>{unreadCount} unread</small></div><button type="button" onClick={markAllRead}>Mark all read</button></div><div className="notification-list">{notifications.length === 0 ? <p className="notification-empty">You are all caught up.</p> : visibleNotifications.map((notification) => <button className={`notification-item ${notification.read ? '' : 'unread'}`} type="button" key={notification.id} onClick={() => markRead(notification.id)}><strong>{notification.title}</strong><span>{notification.message}</span><time dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleDateString()}</time></button>)}</div>{pageCount > 1 && <div className="notification-pagination"><button type="button" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>Previous</button><span>{page + 1} / {pageCount}</span><button type="button" disabled={page === pageCount - 1} onClick={() => setPage((current) => current + 1)}>Next</button></div>}</aside>}</div>
}
