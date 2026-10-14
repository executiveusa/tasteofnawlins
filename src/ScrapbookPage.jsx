import React, { useEffect, useRef, useState } from 'react'
import { galleryMedia } from './gallery-media.js'
import './scrapbook.css'

const filterOptions = [
  { key: 'all', label: 'All memories' },
  { key: 'photo', label: 'Photographs' },
  { key: 'video', label: 'Film clips' },
]

export default function ScrapbookPage() {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const closeButton = useRef(null)
  const opener = useRef(null)
  const entries = galleryMedia.filter((item) => filter === 'all' || item.kind === filter)
  const activeItem = active === null ? null : entries[active]
  const close = () => { setActive(null); requestAnimationFrame(() => opener.current?.focus()) }
  const open = (index, target) => { opener.current = target; setActive(index) }
  const move = (increment) => setActive((index) => (index + increment + entries.length) % entries.length)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Our Scrapbook | Taste of Nawlins'
    return () => { document.title = previousTitle }
  }, [])

  useEffect(() => {
    if (active === null) return undefined
    closeButton.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close() }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
      if (event.key === 'Tab') {
        const focusable = [...document.querySelectorAll('.scrapbook-viewer button:not([disabled])')]
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = previousOverflow }
  }, [active, entries.length])

  return (
    <main className="scrapbook-page">
      <header className="scrapbook-header">
        <a href="/" className="scrapbook-brand">Taste of Nawlins</a>
        <nav aria-label="Scrapbook navigation"><a href="/">Home</a><a href="/taste-of-nawlins-menu.html">Our menu</a><a href="/#follow">Find us</a></nav>
      </header>
      <section className="scrapbook-cover" aria-labelledby="scrapbook-title">
        <div className="scrapbook-cover-inner">
          <span className="scrapbook-overline">The people, the plates, the places</span>
          <p className="scrapbook-archive">A growing collection · Pacific Northwest</p>
          <h1 id="scrapbook-title">The Nawlins<br /><em>scrapbook.</em></h1>
          <p className="scrapbook-intro">Taste of New Orleans started with a dollar and a dream. Thanks to your local support and belief in what we started, that vision has now come to life. Each one of you is like family to us, and we are forever grateful for the moments we get to share. This scrapbook is a living record of those moments. Any photos or moments you capture at our events, send to <a href="mailto:info@tasteofnawlins.food">info@tasteofnawlins.food</a>, and we will add them to our collection.</p>
          <a className="scrapbook-jump" href="#memories">Open the album <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      <section id="memories" className="scrapbook-album" aria-labelledby="memories-title">
        <div className="scrapbook-album-top">
          <div><p className="scrapbook-overline">Collected along the way</p><h2 id="memories-title">Proof is in<br /><em>the people.</em></h2></div>
          <p>The pictures and clips here document real moments from Taste of Nawlins. More pages will be added as the story grows.</p>
        </div>
        <div className="scrapbook-filters" role="group" aria-label="Filter scrapbook">
          {filterOptions.map(({key,label}) => (
            <button type="button" key={key} aria-pressed={filter === key} className={filter === key ? 'is-selected' : ''} onClick={() => { setFilter(key); setActive(null) }}>{label}</button>
          ))}
        </div>
        {entries.length ? (
          <div className="scrapbook-grid">
            {entries.map((item, index) => (
              <figure className={'scrapbook-print scrapbook-print-' + ((index % 4) + 1)} key={item.id}>
                <button className="scrapbook-photo-button" type="button" onClick={(event) => open(index,event.currentTarget)} aria-label={(item.kind === 'video' ? 'Play clip: ' : 'View photo: ') + item.caption}>
                  {item.kind === 'video' ? (
                    <span className="scrapbook-video-frame"><img src={item.poster} alt="" loading="lazy"/><span className="scrapbook-play" aria-hidden="true">▶</span></span>
                  ) : <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />}
                </button>
                <figcaption><span>{item.caption}</span>{item.kind === 'video' && <span className="scrapbook-clip">Film clip</span>}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="scrapbook-empty">
            <p className="scrapbook-overline">More memories to come</p>
            <h3>Film clips are coming.</h3>
            <p>We’ll add our real video moments here once they’re ready to share.</p>
            <button type="button" onClick={() => setFilter('all')}>See all photographs</button>
          </div>
        )}
        <aside className="scrapbook-postscript"><span>From our table to yours</span><p>Thank you for being part of our story!</p><a href="/#follow">Find the next pop-up ↗</a></aside>
      </section>
      <footer className="scrapbook-footer"><span>Taste of Nawlins · New Orleans soul in the Pacific Northwest</span><a href="/">Back to the kitchen ↗</a></footer>
      {activeItem && <div className="scrapbook-viewer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
        <div className="scrapbook-viewer" role="dialog" aria-modal="true" aria-label={'Scrapbook image viewer: ' + activeItem.caption}>
          <div className="scrapbook-viewer-top"><span>{active + 1} / {entries.length} · {activeItem.caption}</span><button ref={closeButton} type="button" onClick={close} aria-label="Close viewer">Close ×</button></div>
          <div className="scrapbook-viewer-image">
            {activeItem.kind === 'video' ? <video key={activeItem.id} controls playsInline autoPlay preload="metadata" poster={activeItem.poster}>
              <source src={activeItem.src} type={activeItem.src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
              {activeItem.captionsSrc && <track src={activeItem.captionsSrc} kind="captions" srcLang="en" label="English" default />}
              Your browser cannot play this video.
            </video> : <img src={activeItem.src} alt={activeItem.alt} />}
          </div>
          <div className="scrapbook-viewer-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous memory">← Previous</button><span>{activeItem.caption}</span><button type="button" onClick={() => move(1)} aria-label="Next memory">Next →</button></div>
        </div>
      </div>}
    </main>
  )
}
