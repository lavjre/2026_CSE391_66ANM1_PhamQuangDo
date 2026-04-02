function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00`)
}

function StatsBar({ data }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingCount = data.filter(
    (conference) => parseDate(conference.date) >= today,
  ).length

  const thisMonthCount = data.filter((conference) => {
    const eventDate = parseDate(conference.date)

    return (
      eventDate.getFullYear() === today.getFullYear() &&
      eventDate.getMonth() === today.getMonth()
    )
  }).length

  const locationCount = new Set(data.map((conference) => conference.location)).size

  const stats = [
    {
      label: 'Total conferences',
      value: data.length,
      accent: 'text-primary',
      bgClass: 'bg-primary-subtle',
    },
    {
      label: 'Upcoming',
      value: upcomingCount,
      accent: 'text-success',
      bgClass: 'bg-success-subtle',
    },
    {
      label: 'This month',
      value: thisMonthCount,
      accent: 'text-warning',
      bgClass: 'bg-warning-subtle',
    },
    {
      label: 'Locations',
      value: locationCount,
      accent: 'text-dark',
      bgClass: 'bg-light',
    },
  ]

  return (
    <div className="px-3 px-md-4 mt-4">
      <div className="row row-cols-2 row-cols-xl-4 g-3">
        {stats.map((item) => (
          <div key={item.label} className="col">
            <div className={`card border-0 shadow-sm h-100 ${item.bgClass}`}>
              <div className="card-body">
                <div className={`display-6 fw-bold ${item.accent}`}>{item.value}</div>
                <div className="text-muted">{item.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsBar
