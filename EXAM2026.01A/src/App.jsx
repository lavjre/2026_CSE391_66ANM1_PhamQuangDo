import { useMemo, useState } from 'react'

import DataTable from './components/DataTable'
import Header from './components/Header'
import ModalForm from './components/ModalForm'
import ConferenceForm from './components/NewForm'
import SearchBar from './components/SearchBar'
import StatsBar from './components/StatsBar'
import conferenceData from './data/data'

function App() {
  const [data, setData] = useState(conferenceData)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  const filteredData = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return data.filter((conference) => {
      const haystack = [
        conference.conferenceName,
        conference.speakerName,
        conference.email,
        conference.location,
      ]
        .join(' ')
        .toLowerCase()

      const matchesKeyword =
        normalizedKeyword.length === 0 || haystack.includes(normalizedKeyword)
      const matchesLocation =
        locationFilter.length === 0 || conference.location === locationFilter

      return matchesKeyword && matchesLocation
    })
  }, [data, keyword, locationFilter])

  const locations = useMemo(
    () =>
      Array.from(new Set(data.map((conference) => conference.location))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [data],
  )

  const handleOpenAdd = () => {
    setEditItem(null)
    setShowModal(true)
  }

  const handleOpenEdit = (conference) => {
    setEditItem(conference)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditItem(null)
  }

  const handleSubmit = (formData) => {
    if (editItem) {
      setData((prev) =>
        prev.map((conference) =>
          conference.id === formData.id ? formData : conference,
        ),
      )
      return
    }

    setData((prev) => [formData, ...prev])
  }

  const handleDelete = (id) => {
    const shouldDelete = window.confirm(
      'Delete this conference? This action cannot be undone.',
    )

    if (!shouldDelete) return

    setData((prev) => prev.filter((conference) => conference.id !== id))
  }

  return (
    <>
      <Header
        title="Conference Hub"
        searchValue={keyword}
        onSearchChange={setKeyword}
        onAdd={handleOpenAdd}
      />

      <main className="min-vh-100 bg-body-tertiary pb-5">
        <section id="home" className="px-3 px-md-4 pt-4">
          <div
            className="rounded-4 p-4 p-lg-5 text-white shadow"
            style={{
              background:
                'linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(29, 78, 216) 55%, rgb(56, 189, 248) 100%)',
            }}
          >
            <div className="row g-4 align-items-center">
              <div className="col-lg-7">
                <span className="badge text-bg-light text-primary mb-3">
                  React conference frontend
                </span>
                <h1 className="display-6 fw-bold mb-3">
                  Manage upcoming conferences, speakers, and locations from one
                  dashboard.
                </h1>
                <p className="lead mb-0">
                  Use the quick search in the header or the larger filter bar
                  below to find records fast and keep the list up to date.
                </p>
              </div>

              <div className="col-lg-5">
                <div className="bg-white text-dark rounded-4 p-4 h-100 shadow-sm">
                  <div className="small text-uppercase text-secondary fw-semibold mb-2">
                    Ready to add one more?
                  </div>
                  <h2 className="h4 mb-2">Create a new conference entry</h2>
                  <p className="text-muted mb-3">
                    Store the conference name, speaker, contact email, date,
                    and location in one form.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOpenAdd}
                  >
                    Add New Conference
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <StatsBar data={data} />

        <section id="conference-list">
          <SearchBar
            searchValue={keyword}
            onSearchChange={setKeyword}
            locationValue={locationFilter}
            onLocationChange={setLocationFilter}
            locations={locations}
            totalResults={filteredData.length}
            onAdd={handleOpenAdd}
          />

          <DataTable
            data={filteredData}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </section>

        <section id="about" className="px-3 px-md-4 mt-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="h5 mb-2">About</h2>
              <p className="text-muted mb-0">
                Conference Hub is a lightweight React frontend backed by
                `data.js`. It includes quick search, a location filter, and a
                modal form for adding or editing conference records.
              </p>
            </div>
          </div>
        </section>
      </main>

      <ModalForm
        show={showModal}
        onClose={handleClose}
        title={editItem ? 'Edit Conference' : 'Add New Conference'}
        size="lg"
      >
        <ConferenceForm
          defaultValues={editItem}
          isOpen={showModal}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      </ModalForm>
    </>
  )
}

export default App
