export const LOCATION_OPTIONS = [
  'Bangkok',
  'Berlin',
  'Boston',
  'Online',
  'Singapore',
  'Tokyo',
]

export function getTodayISO() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const localTime = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  return localTime.toISOString().split('T')[0]
}

function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00`)
}

export function validateForm(form) {
  const errors = {}

  if (!form.conferenceName.trim()) {
    errors.conferenceName = 'Conference name is required.'
  } else if (form.conferenceName.trim().length > 60) {
    errors.conferenceName = 'Conference name must be 60 characters or fewer.'
  }

  if (!form.speakerName.trim()) {
    errors.speakerName = 'Speaker name is required.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Contact email is required.'
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!form.location.trim()) {
    errors.location = 'Location is required.'
  }

  if (!form.date) {
    errors.date = 'Conference date is required.'
  } else {
    const today = parseDate(getTodayISO())
    const selectedDate = parseDate(form.date)

    if (selectedDate < today) {
      errors.date = 'Conference date must be today or later.'
    }
  }

  return errors
}

export function isValid(errors) {
  return Object.keys(errors).length === 0
}
