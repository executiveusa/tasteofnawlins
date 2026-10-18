import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeNextStop, readableStopDate, navigationLinks } from '../src/next-stop.js'

const sample = {
  status: 'scheduled',
  venue: 'Test Venue — Not a Real Event',
  address: '123 Example Street, Seattle, WA 98101',
  date: '2099-08-20',
  hours: '11 AM – 3 PM',
  detail: 'Test fixture, not for production',
  timeZone: 'America/Los_Angeles',
}

test('unannounced and incomplete stops never publish directions', () => {
  assert.equal(normalizeNextStop({ status: 'unannounced' }), null)
  assert.equal(normalizeNextStop({ ...sample, address: '' }), null)
  assert.equal(normalizeNextStop({ ...sample, venue: ' ' }), null)
  assert.equal(normalizeNextStop({ ...sample, hours: '' }), null)
  assert.equal(normalizeNextStop({ ...sample, date: '2099-02-30' }), null)
  assert.equal(normalizeNextStop({ ...sample, date: 'not-a-date' }), null)
  assert.equal(normalizeNextStop({ ...sample, timeZone: 'not/a/timezone' }), null)
})

test('a previously scheduled stop expires after its local calendar date', () => {
  assert.equal(normalizeNextStop({ ...sample, date: '2020-01-02' }, new Date('2026-10-18T12:00:00Z')), null)
})

test('valid scheduled stop is normalized without inventing coordinates', () => {
  const stop = normalizeNextStop(sample, new Date('2026-10-18T12:00:00Z'))
  assert.equal(stop?.venue, sample.venue)
  assert.equal(stop?.address, sample.address)
  assert.equal(stop?.hours, sample.hours)
  assert.equal(stop?.date, sample.date)
  assert.equal(stop?.lat, undefined)
  assert.equal(readableStopDate('2099-08-20'), 'Thursday, August 20, 2099')
})

test('navigation links encode addresses and support common map apps', () => {
  const address = '123 Example Street, Seattle, WA 98101'
  const links = navigationLinks(address, 'Mozilla/5.0 (iPhone)')
  assert.ok(links.google.startsWith('https://www.google.com/maps/dir/?api=1&destination='))
  assert.ok(links.apple.startsWith('https://maps.apple.com/?daddr='))
  assert.ok(links.waze.startsWith('https://waze.com/ul?q='))
  assert.ok(links.waze.endsWith('&navigate=yes'))
  assert.equal(links.suggested, links.apple)
  assert.ok(links.google.includes('Example%20Street%2C%20Seattle%2C%20WA%2098101'))
  assert.ok(navigationLinks(address, 'Mozilla/5.0 (Android)').suggested.startsWith('geo:0,0?q='))
  assert.equal(navigationLinks('', 'iPhone'), null)
  assert.equal(navigationLinks('   ', 'Android'), null)
})
