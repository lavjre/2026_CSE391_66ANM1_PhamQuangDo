function SearchBar({
  searchValue,
  onSearchChange,
  locationValue,
  onLocationChange,
  locations,
  totalResults,
  onAdd,
}) {
  return (
    <div className="px-3 px-md-4 mt-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <h2 className="h4 mb-1">Conference list</h2>
              <p className="text-muted mb-0">
                Search by conference name, speaker, email, or location.
              </p>
            </div>
            <span className="badge text-bg-dark rounded-pill px-3 py-2">
              {totalResults} result{totalResults === 1 ? '' : 's'}
            </span>
          </div>

          <div className="row g-3 align-items-end">
            <div className="col-lg-7">
              <label htmlFor="conferenceSearch" className="form-label fw-semibold">
                Search conferences
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text">Search</span>
                <input
                  id="conferenceSearch"
                  type="search"
                  className="form-control"
                  placeholder="AI Summit, Jane Doe, jane@example.com..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-3">
              <label htmlFor="locationFilter" className="form-label fw-semibold">
                Filter by location
              </label>
              <select
                id="locationFilter"
                className="form-select form-select-lg"
                value={locationValue}
                onChange={(e) => onLocationChange(e.target.value)}
              >
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 d-grid">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={onAdd}
              >
                Add New
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
