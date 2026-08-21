export type RemotePost = { id: number; title: string; body: string }

export async function getNotificationPosts(): Promise<RemotePost[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
  if (!response.ok) throw new Error('Unable to load notifications')
  return response.json() as Promise<RemotePost[]>
}
