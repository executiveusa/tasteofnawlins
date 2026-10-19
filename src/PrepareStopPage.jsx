import React, { useEffect, useState } from 'react'
import NextStopCard from './NextStopCard.jsx'
import { normalizeNextStop, FALLBACK_TIME_ZONE } from './next-stop.js'
import './prepare-stop.css'

const empty = { status: 'scheduled', venue: '', address: '', date: '', hours: '', detail: '', timeZone: FALLBACK_TIME_ZONE }

export default function PrepareStopPage() {
  const [draft, setDraft] = useState(empty)
  const [confirmed, setConfirmed] = useState(false)
  const [message, setMessage] = useState('')
  const stop = normalizeNextStop(draft)
  const pending = draft.status === 'unannounced'
  useEffect(() => {
    const title = document.title
    document.title = 'Prepare a kitchen stop | Taste of Nawlins'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.append(meta)
    return () => { document.title = title; meta.remove() }
  }, [])
  const update = (event) => {
    setDraft({ ...draft, [event.target.name]: event.target.value })
    setConfirmed(false)
    setMessage('')
  }
  const download = (event) => {
    event.preventDefault()
    const valid = normalizeNextStop(draft)
    if ((!pending && !valid) || !confirmed) {
      setMessage('Check the required details and confirmation before downloading.')
      return
    }
    const data = pending ? { ...empty, status: 'unannounced' } : valid
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'next-stop.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('File prepared. The live website has not changed. Send this file to your website publisher for preview and approval.')
  }
  return (
    <main className="prepare-stop">
      <a href="/" className="prepare-home">← Back to the kitchen</a>
      <img className="prepare-logo" src="/brand/taste-of-nawlins-wordmark.svg" alt="Taste of Nawlins — Pop Up Kitchen" width="2048" height="1536" />
      <h1>Prepare the next stop</h1>
      <p>Enter a confirmed stop, check the preview, then download the file for your website publisher. This page does not publish or save your entries.</p>
      <div className="prepare-columns">
        <form onSubmit={download}>
          <label>Announcement<select name="status" value={draft.status} onChange={update}>
            <option value="scheduled">Announce a confirmed stop</option>
            <option value="unannounced">No confirmed stop / remove announcement</option>
          </select></label>
          {!pending && <>
            <label>Venue name<input name="venue" value={draft.venue} onChange={update} required maxLength={160} autoComplete="off" /></label>
            <label>Full public address<input name="address" value={draft.address} onChange={update} required maxLength={300} autoComplete="off" aria-describedby="address-note" /></label>
            <p id="address-note" className="prepare-note">Include the street, city, state and ZIP. Publish only a venue you have permission to announce.</p>
            <label>Service date<input name="date" type="date" value={draft.date} onChange={update} required /></label>
            <label>Service hours<input name="hours" value={draft.hours} onChange={update} required maxLength={120} placeholder="Start – end time, including AM or PM" /></label>
            <label>Time zone<select name="timeZone" value={draft.timeZone} onChange={update}>
              <option value="America/Los_Angeles">Pacific time (Washington / Oregon)</option>
              <option value="America/Denver">Mountain time</option>
              <option value="America/Phoenix">Arizona time</option>
              <option value="America/Chicago">Central time</option>
              <option value="America/New_York">Eastern time</option>
            </select></label>
            <label>Parking or entrance note (optional)<textarea name="detail" value={draft.detail} onChange={update} maxLength={600} rows="3" /></label>
          </>}
          {!pending && !stop && <p className="prepare-note" role="status">Complete all required details with today’s or a future date to preview directions.</p>}
          <label className="prepare-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} required />
            <span>{pending ? 'I want the live website to show that the next stop is pending.' : 'I confirmed the venue’s permission, address, date and hours. I checked the map destinations.'}</span>
          </label>
          <button type="submit" disabled={(!pending && !stop) || !confirmed}>Download announcement file</button>
          <p role="status" className="prepare-message">{message}</p>
        </form>
        <section aria-label="Announcement preview" className="prepare-preview">
          <h2>Preview only</h2>
          <NextStopCard stop={pending ? null : stop} />
          <p className="prepare-note">Use the map links to check the destination. No customer account, app download or location permission is required by this website.</p>
          <h2>Then publish with your agent</h2>
          <p>Send the downloaded file to your website publisher with: “Prepare this kitchen stop for review. Show me the preview before publishing.”</p>
          <p>Your publisher replaces the website’s announcement file through a reviewed update. Check the live address and directions after the release.</p>
        </section>
      </div>
    </main>
  )
}
