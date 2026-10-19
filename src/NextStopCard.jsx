import React, { useEffect, useState } from 'react'
import { normalizeNextStop, readableStopDate, navigationLinks } from './next-stop.js'
import './next-stop.css'

export function useNextStop(enabled = true) {
  const [stop, setStop] = useState(null)
  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    fetch('/next-stop.json', { cache: 'no-store', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Next-stop data not available')
        return response.json()
      })
      .then((data) => { if (!controller.signal.aborted) setStop(normalizeNextStop(data)) })
      .catch(() => { if (!controller.signal.aborted) setStop(null) })
    return () => controller.abort()
  }, [enabled])
  return stop
}

function PinIcon() {
  return (
    <svg viewBox="0 0 52 68" width="52" height="68" fill="none" aria-hidden="true" focusable="false">
      <path d="M26 63C26 63 6 42 6 27a20 20 0 0 1 40 0C46 42 26 63 26 63Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="26" cy="27" r="7.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export default function NextStopCard({ stop }) {
  const navigation = stop ? navigationLinks(stop.address,
    typeof navigator === 'undefined' ? '' : navigator.userAgent) : null

  return (
    <section className={`next-stop-card ${stop ? 'next-stop-card-scheduled' : 'next-stop-card-pending'}`}
      aria-labelledby="next-stop-title">
      <div className="next-stop-topline">
        <span className="next-stop-eyebrow">The next kitchen stop</span>
        <span className="next-stop-indicator"><span aria-hidden="true" />{stop ? 'Location announced' : 'Next stop pending'}</span>
      </div>
      <div className="next-stop-main">
        <div className="next-stop-content">
          {stop ? (
            <>
              <h3 id="next-stop-title">{stop.venue}</h3>
              <p className="next-stop-date"><time dateTime={stop.date}>{readableStopDate(stop.date)}</time><span aria-hidden="true"> · </span>{stop.hours}</p>
              <address className="next-stop-address">{stop.address}</address>
              {stop.detail && <p className="next-stop-detail">{stop.detail}</p>}
            </>
          ) : (
            <>
              <h3 id="next-stop-title">Good food.<br />Next stop soon.</h3>
              <p className="next-stop-empty">We haven't announced the next location yet. When the address is confirmed, directions will appear right here.</p>
            </>
          )}
        </div>
        <div className="next-stop-pin" aria-hidden="true"><PinIcon /><span className="next-stop-route" /></div>
      </div>
      {navigation ? (
        <div className="next-stop-actions">
          <a className="next-stop-primary" href={navigation.suggested}
            target={navigation.suggested.startsWith('geo:') ? undefined : '_blank'}
            rel={navigation.suggested.startsWith('geo:') ? undefined : 'noopener noreferrer'}>
            Get directions <span aria-hidden="true">↗</span>
          </a>
          <div className="next-stop-alternatives" aria-label="Choose your navigation app">
            <span className="next-stop-choose">Or use</span>
            <a href={navigation.apple} target="_blank" rel="noopener noreferrer">Apple Maps <span aria-hidden="true">↗</span></a>
            <a href={navigation.google} target="_blank" rel="noopener noreferrer">Google Maps <span aria-hidden="true">↗</span></a>
            <a href={navigation.waze} target="_blank" rel="noopener noreferrer">Waze <span aria-hidden="true">↗</span></a>
          </div>
          <p className="next-stop-footnote">Directions open in your chosen map app or browser. We don't track your location.</p>
        </div>
      ) : (
        <div className="next-stop-actions">
          <a className="next-stop-pending-link" href="https://www.instagram.com/tasteofnawlins.food/"
            target="_blank" rel="noopener noreferrer">
            Check our Instagram for announcements <span aria-hidden="true">↗</span>
          </a>
          <p className="next-stop-footnote">No address is published until the next stop is confirmed.</p>
        </div>
      )}
    </section>
  )
}
