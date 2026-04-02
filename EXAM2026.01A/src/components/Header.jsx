function Header({ title, searchValue, onSearchChange, onAdd }) {
  return (
    <nav className="navbar navbar-expand-xl navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container-fluid px-3 px-md-4 gap-3">
        <a
          className="navbar-brand d-flex align-items-center gap-3 fw-bold mb-0"
          href="#home"
        >
          <span className="rounded-3 bg-primary text-white px-3 py-2">
            CH
          </span>
          <span>{title}</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#conferenceNav"
          aria-controls="conferenceNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse gap-3" id="conferenceNav">
          <div className="mx-xl-auto flex-xl-grow-1" style={{ maxWidth: '380px' }}>
            <label htmlFor="headerQuickSearch" className="visually-hidden">
              Quick search
            </label>
            <div className="input-group">
              <span className="input-group-text bg-body-tertiary border-0">
                Search
              </span>
              <input
                id="headerQuickSearch"
                type="search"
                className="form-control border-0 bg-body-tertiary"
                placeholder="Quick search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <ul className="navbar-nav ms-auto align-items-xl-center gap-xl-2">
            <li className="nav-item">
              <a className="nav-link" href="#home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#conference-list">
                List
              </a>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onAdd}
              >
                Add New
              </button>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
