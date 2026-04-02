import { useEffect, useState } from 'react'

import {
  getTodayISO,
  isValid,
  LOCATION_OPTIONS,
  validateForm,
} from '../utils/validate'

const EMPTY_FORM = {
  conferenceName: '',
  speakerName: '',
  email: '',
  date: '',
  location: '',
}

function ConferenceForm({ defaultValues = null, onSubmit, onClose, isOpen = false }) {
  const [form, setForm] = useState(defaultValues ?? EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    setForm(defaultValues ?? EMPTY_FORM)
    setErrors({})
    setIsSubmitting(false)
  }, [defaultValues, isOpen])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (!errors[name]) return

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateForm(form)

    if (!isValid(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    onSubmit({
      ...form,
      id: defaultValues?.id ?? Date.now(),
      conferenceName: form.conferenceName.trim(),
      speakerName: form.speakerName.trim(),
      email: form.email.trim().toLowerCase(),
      location: form.location.trim(),
    })

    if (!defaultValues) {
      setForm(EMPTY_FORM)
    }

    setErrors({})
    setIsSubmitting(false)
    onClose()
  }

  const getFieldClass = (fieldName, baseClass = 'form-control') =>
    errors[fieldName] ? `${baseClass} is-invalid` : baseClass

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <label htmlFor="conferenceName" className="form-label fw-semibold">
            Conference name
          </label>
          <input
            id="conferenceName"
            name="conferenceName"
            type="text"
            className={getFieldClass('conferenceName')}
            value={form.conferenceName}
            onChange={handleChange}
            placeholder="AI for Education Summit"
            maxLength={60}
          />
          {errors.conferenceName ? (
            <div className="invalid-feedback">{errors.conferenceName}</div>
          ) : null}
        </div>

        <div className="col-md-4">
          <label htmlFor="location" className="form-label fw-semibold">
            Location
          </label>
          <select
            id="location"
            name="location"
            className={getFieldClass('location', 'form-select')}
            value={form.location}
            onChange={handleChange}
          >
            <option value="">Select a location</option>
            {LOCATION_OPTIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          {errors.location ? (
            <div className="invalid-feedback">{errors.location}</div>
          ) : null}
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label htmlFor="speakerName" className="form-label fw-semibold">
            Speaker
          </label>
          <input
            id="speakerName"
            name="speakerName"
            type="text"
            className={getFieldClass('speakerName')}
            value={form.speakerName}
            onChange={handleChange}
            placeholder="Dr. Jane Doe"
          />
          {errors.speakerName ? (
            <div className="invalid-feedback">{errors.speakerName}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label fw-semibold">
            Contact email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={getFieldClass('email')}
            value={form.email}
            onChange={handleChange}
            placeholder="speaker@conference.com"
          />
          {errors.email ? (
            <div className="invalid-feedback">{errors.email}</div>
          ) : null}
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label htmlFor="date" className="form-label fw-semibold">
            Conference date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className={getFieldClass('date')}
            value={form.date}
            onChange={handleChange}
            min={getTodayISO()}
          />
          {errors.date ? (
            <div className="invalid-feedback">{errors.date}</div>
          ) : null}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 border-top pt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : defaultValues
              ? 'Update Conference'
              : 'Create Conference'}
        </button>
      </div>
    </form>
  )
}

export default ConferenceForm
