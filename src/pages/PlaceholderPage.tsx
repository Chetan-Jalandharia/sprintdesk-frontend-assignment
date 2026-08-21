type PlaceholderPageProps = { title: string; description: string }

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return <main className="workspace"><p className="eyebrow">SprintDesk workspace</p><h1>{title}</h1><p className="page-subtitle">{description}</p><div className="state-panel">This functional area is queued for the next implementation step.</div></main>
}
