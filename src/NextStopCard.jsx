import React, { useEffect, useRef, useState } from 'react'
import { normalizeNextStop, readableStopDate, navigationLinks } from './next-stop.js'
import './next-stop.css'
import StopAnnouncementDialog from './StopAnnouncementDialog.jsx'

export function useNextStop(enabled = true) {
  const [stop, setStop] = useState(null)
  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    let candidate = null
    let loading = false
    const validate = () => setStop(normalizeNextStop(candidate))
    const refresh = async () => {
      // Expire the currently displayed stop even if the network is unavailable.
      validate()
      if (loading) return
      loading = true
      try {
        const response = await fetch('/next-stop.json', { cache: 'no-store', signal: controller.signal })
        if (!response.ok) throw new Error('Next-stop data not available')
        candidate = await response.json()
      } catch (_) {
        candidate = null
      } finally {
        loading = false
        if (!controller.signal.aborted) validate()
      }
    }
    const resume = () => { if (document.visibilityState === 'visible') refresh() }
    refresh()
    // Recheck open tabs and refresh changed/cancelled announcements without reload.
    const interval = window.setInterval(refresh, 60_000)
    document.addEventListener('visibilitychange', resume)
    window.addEventListener('focus', refresh)
    return () => {
      controller.abort()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', resume)
      window.removeEventListener('focus', refresh)
    }
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
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const takeMeThere = useRef(null)
  useEffect(() => { if (stop) setShowAnnouncement(false) }, [stop])
  const navigation = stop ? navigationLinks(stop.address,
    typeof navigator === 'undefined' ? '' : navigator.userAgent) : null

  return (
    <section className={`next-stop-card ${stop ? 'next-stop-card-scheduled' : 'next-stop-card-pending'}`}
      aria-labelledby="next-stop-title">
      <div className="next-stop-topline">
        <span className="next-stop-eyebrow">Pop-up location & directions</span>
        {stop && <span className="next-stop-indicator"><span aria-hidden="true" />Location announced</span>}
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
              <h3 id="next-stop-title">Next location not announced</h3>
              <p className="next-stop-empty">We haven’t published our next pop-up yet. Once confirmed, the location and serving details will appear here. Tap Take me there for updates.</p>
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
            Take me there <span aria-hidden="true">↗</span>
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
          <button ref={takeMeThere} type="button" className="next-stop-primary next-stop-invite" aria-haspopup="dialog"
            onClick={() => setShowAnnouncement(true)}>Take me there <span aria-hidden="true">↗</span></button>
          <p className="next-stop-footnote">No stop announced? Tap for text alerts and the free-gift raffle request.</p>
          <a className="next-stop-pending-link" href="https://www.instagram.com/tasteofnawlins.food/"
            target="_blank" rel="noopener noreferrer">
            See pop-up announcements on Instagram <span aria-hidden="true">↗</span>
          </a>
          <p className="next-stop-footnote">Check back here for the next confirmed location.</p>
        </div>
      )}
      {showAnnouncement && !stop && <StopAnnouncementDialog opener={takeMeThere} onDismiss={() => setShowAnnouncement(false)} />}
    </section>
  )
}
