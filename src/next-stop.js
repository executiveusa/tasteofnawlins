// One public data source for every upcoming Taste of Nawlins stop.
// Never render directions from incomplete data or a date that has passed.
export const FALLBACK_TIME_ZONE = 'America/Los_Angeles'

function localDayISO(now, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const part = (key) => parts.find(({ type }) => type === key)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function normalizeNextStop(candidate, now = new Date()) {
  if (!candidate || candidate.status !== 'scheduled') return null
  const venue = typeof candidate.venue === 'string' ? candidate.venue.trim() : ''
  const address = typeof candidate.address === 'string' ? candidate.address.trim() : ''
  const date = typeof candidate.date === 'string' ? candidate.date.trim() : ''
  const hours = typeof candidate.hours === 'string' ? candidate.hours.trim() : ''
  const detail = typeof candidate.detail === 'string' ? candidate.detail.trim() : ''
  const timeZone = typeof candidate.timeZone === 'string' && candidate.timeZone.trim()
    ? candidate.timeZone.trim() : FALLBACK_TIME_ZONE
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00Z`) : null
  if (!venue || !address || !hours || !parsedDate || Number.isNaN(parsedDate.valueOf()) ||
      parsedDate.toISOString().slice(0, 10) !== date) return null
  try {
    if (date < localDayISO(now, timeZone)) return null
  } catch (_) {
    return null
  }
  return { status: 'scheduled', venue, address, date, hours, detail, timeZone }
}

export function readableStopDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(date)
}

export function navigationLinks(address, userAgent = '') {
  if (typeof address !== 'string' || !address.trim()) return null
  const destination = encodeURIComponent(address.trim())
  const google = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
  const apple = `https://maps.apple.com/?daddr=${destination}`
  const waze = `https://waze.com/ul?q=${destination}&navigate=yes`
  // Android geo: asks its installed map apps to resolve the requested location.
  // On iOS Apple Maps is supported; the explicit links below offer alternatives.
  const suggested = /android/i.test(userAgent)
    ? `geo:0,0?q=${destination}`
    : /iPad|iPhone|iPod/i.test(userAgent) ? apple : google
  return { suggested, google, apple, waze }
}
