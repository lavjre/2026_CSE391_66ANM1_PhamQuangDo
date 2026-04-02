function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00`)
}

function formatDate(dateString) {
  if (!dateString) return '—'

  return parseDate(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getScheduleBadge(dateString) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const eventDate = parseDate(dateString)
  const diffInDays = Math.round((eventDate - today) / 86400000)

  if (diffInDays === 0) {
    return { label: 'Today', className: 'text-bg-success' }
  }

  if (diffInDays > 0 && diffInDays <= 7) {
    return { label: 'This week', className: 'text-bg-warning' }
  }

  if (diffInDays > 7) {
    return { label: 'Upcoming', className: 'text-bg-primary' }
  }

  return { label: 'Past', className: 'text-bg-secondary' }
}

function DataTable({ data, onDelete, onEdit }) {
  if (data.length === 0) {
    return (
      <div className="px-3 px-md-4 mt-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5 text-muted">
            <div className="display-5 mb-3">No results</div>
            <p className="mb-0">
              No conferences match the current search or location filter.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 px-md-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0">
          Showing <strong>{data.length}</strong> conference
          {data.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="table-responsive rounded-4 shadow-sm">
        <table className="table table-hover align-middle mb-0 bg-white">
          <thead className="table-light">
            <tr>
              <th scope="col" className="text-center" style={{ width: '60px' }}>
                #
              </th>
              <th scope="col">Conference</th>
              <th scope="col" className="d-none d-md-table-cell">
                Speaker
              </th>
              <th scope="col" className="d-none d-lg-table-cell">
                Contact
              </th>
              <th scope="col">Date</th>
              <th scope="col">Location</th>
              <th scope="col" className="text-center">
                Status
              </th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((conference, index) => {
              const schedule = getScheduleBadge(conference.date)

              return (
                <tr key={conference.id}>
                  <td className="text-center text-muted">{index + 1}</td>
                  <td>
                    <div className="fw-semibold">{conference.conferenceName}</div>
                    <div className="small text-muted d-md-none">
                      {conference.speakerName}
                    </div>
                  </td>
                  <td className="d-none d-md-table-cell">{conference.speakerName}</td>
                  <td className="d-none d-lg-table-cell text-muted">
                    {conference.email}
                  </td>
                  <td className="text-nowrap">{formatDate(conference.date)}</td>
                  <td>
                    <span className="badge rounded-pill text-bg-light border">
                      {conference.location}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`badge rounded-pill ${schedule.className}`}>
                      {schedule.label}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(conference)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(conference.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
