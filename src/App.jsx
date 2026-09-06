import React, { useEffect } from 'react'
import './photo-quality.css'

const menu = [
  { name: 'Beignets', note: 'Pillowy squares of fried dough, served hot under a generous snowfall of powdered sugar.', price: 'Coming soon' },
  { name: 'Chicory Coffee', note: 'Dark-roasted coffee cut with roasted chicory for a deep, earthy cup with a smooth caramel finish.', price: 'Coming soon' },
  { name: 'Red Beans', note: 'Slow-simmered red beans with Creole seasoning, warm spice and a rich, savory finish.', price: 'Coming soon' },
]

const photoSet = (name, widths) => widths.map((width) => `/images/${name}-${width}.webp ${width}w`).join(', ')
const galleryWidths = (name) => name === 'table' ? [1280, 1920, 2880, 3840] : [720, 1440, 2400]

const storyFrames = [
  { name: 'counter', className: 'story-frame-counter', width: 4504, height: 6006, alt: 'Taste of Nawlins food being handed across a neighborhood counter', caption: 'Made to travel. Handed over in person.' },
  { name: 'first-taste', className: 'story-frame-first-taste', width: 3616, height: 5430, alt: 'A customer holding a Taste of Nawlins food container', caption: 'A little New Orleans, wherever the day takes us.' },
  { name: 'walmart', className: 'story-frame-walmart', width: 2880, height: 5120, alt: 'A worker holding a Taste of Nawlins food container', caption: 'First tastes become the story.' },
  { name: 'table', className: 'story-frame-table', width: 6070, height: 4928, alt: 'People gathered around a table with Taste of Nawlins food', caption: 'The table is the point.' },
]

function PreviewForm({ type }) {
  const onSubmit = (event) => {
    event.preventDefault()
    const box = event.currentTarget.querySelector('[data-preview-message]')
    if (box) box.textContent = 'Preview only — live storage is connected in a later slice.'
  }
  if (type === 'email') {
    return (
      <form className="signup-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" placeholder="Email address" required />
        <button type="submit">Follow the kitchen</button>
        <p className="form-note" data-preview-message aria-live="polite">Pop-ups, menu drops and Boxing & Beignets. No spam.</p>
      </form>
    )
  }
  return (
    <form className="catering-form" onSubmit={onSubmit}>
      <div className="field-pair">
        <label>Name<input name="name" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <div className="field-pair">
        <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
        <label>Event date<input name="eventDate" type="date" /></label>
      </div>
      <div className="field-pair">
        <label>Guest count<input name="guestCount" type="number" min="1" inputMode="numeric" /></label>
        <label>Pickup or delivery<select name="fulfillment"><option>Not sure yet</option><option>Pickup</option><option>Delivery</option></select></label>
      </div>
      <label>Tell us about the event<textarea name="notes" rows="4" /></label>
      <button type="submit">Request catering</button>
      <p className="form-note" data-preview-message aria-live="polite">Preview form — live lead capture is not connected yet.</p>
    </form>
  )
}

export default function App() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-motion]')
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Taste of Nawlins home">Taste of Nawlins</a>
        <nav aria-label="Primary navigation">
          <a href="#menu">Menu</a>
          <a href="#catering">Catering</a>
          <a href="#boxing">Boxing & Beignets</a>
        </nav>
      </header>
      <section className="hero" id="top">
        <picture className="hero-image">
          <source media="(max-width: 760px)" srcSet={photoSet('counter', [720, 1440, 2400])} sizes="100vw" />
          <img src="/images/table-1920.webp" srcSet={photoSet('table', [1280, 1920, 2880, 3840])} sizes="100vw" width="6070" height="4928" alt="Taste of Nawlins community table" loading="eager" decoding="async" fetchPriority="high" />
        </picture>
        <div className="hero-copy hero-enter">
          <p className="eyebrow">New Orleans · Pacific Northwest</p>
          <h1>New Orleans food,<br />wherever we pull up.</h1>
          <p className="hero-deck">Beignets · Chicory coffee · Red beans</p>
          <a className="primary-link" href="#menu">See what’s cooking</a>
        </div>
      </section>
      <section className="next-drop drop-enter" aria-label="Next service drop">
        <div className="drop-kicker"><span className="eyebrow">Next drop</span><strong>Coming soon</strong></div>
        <div className="drop-meta"><span>Beignets + chicory coffee</span><span>Location announcing soon</span></div>
        <a href="#follow">Follow the kitchen →</a>
      </section>
      <section className="menu-section" id="menu">
        <div className="section-heading" data-motion="quiet">
          <p className="eyebrow">The menu</p><h2>Simple Classics</h2><p>3 delicious New Orleans staples, every day.</p>
        </div>
        <div className="menu-list" data-motion="rows">
          {menu.map((item, index) => (
            <article className="menu-row" key={item.name} style={{ '--row': index }}>
              <span className="menu-index">0{index + 1}</span>
              <div><h3>{item.name}</h3><p>{item.note}</p></div>
              <span className="menu-price">{item.price}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="field-notes" aria-labelledby="field-notes-title">
        <div className="field-notes-heading" data-motion="quiet"><p className="eyebrow">Around town</p><h2 id="field-notes-title">A kitchen that<br />meets you there.</h2></div>
        <div className="story-gallery">
          {storyFrames.map((frame, index) => (
            <figure className={`story-frame story-frame-${index + 1}`} data-motion="photo" style={{ '--photo': index }} key={frame.className}>
              <img className={`story-image ${frame.className}`} src={`/images/${frame.name}-${frame.name === 'table' ? 1920 : 1440}.webp`} srcSet={photoSet(frame.name, galleryWidths(frame.name))} sizes="(max-width: 760px) 100vw, 50vw" width={frame.width} height={frame.height} alt={frame.alt} loading="lazy" decoding="async" />
              <figcaption><span>0{index + 1}</span>{frame.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="story-statement" aria-label="Taste of Nawlins story">
        <p className="eyebrow" data-motion="quiet">Food · people · purpose</p>
        <blockquote data-motion="statement">Taste of Nawlins is a pop up kitchen with a purpose</blockquote>
      </section>
      <section className="boxing-section" id="boxing">
        <div className="boxing-title" data-motion="quiet"><p className="eyebrow">A recurring community event</p><h2>Boxing<br />& Beignets</h2></div>
        <div className="boxing-copy" data-motion="quiet">
          <h3>Food. Fighters. Mentorship.</h3>
          <p>Taste of Nawlins supports youth through boxing and mentorship. Boxing & Beignets is the recurring event where the food business and the mission meet through interviews, community partners and fundraising.</p>
          <div className="inline-links"><a href="#follow">Get the next date</a><a href="#catering">Partner with us</a></div>
        </div>
      </section>
      <section className="catering-section" id="catering">
        <div className="section-heading compact" data-motion="quiet"><p className="eyebrow">Catering</p><h2>Bring Nawlins<br />to the table.</h2><p>Small gatherings, community events and pop-ups. Tell us what you’re planning.</p></div>
        <div data-motion="quiet"><PreviewForm type="catering" /></div>
      </section>
      <section className="follow-section" id="follow">
        <div data-motion="quiet"><p className="eyebrow">Follow the kitchen</p><h2>Know where we’re<br />cooking next.</h2></div>
        <div data-motion="quiet"><PreviewForm type="email" /></div>
      </section>
      <footer className="editorial-footer">
        <div className="footer-topline"><span className="eyebrow">Stay close</span><span className="footer-location">New Orleans soul · Pacific Northwest</span></div>
        <div className="footer-social" aria-label="Social media" data-motion="footer">
          <a className="social-word social-instagram" href="#top" aria-label="Instagram placeholder"><span>Instagram</span><b aria-hidden="true">↗</b></a>
          <a className="social-word social-facebook" href="#top" aria-label="Facebook placeholder"><span>Facebook</span><b aria-hidden="true">↗</b></a>
        </div>
        <div className="footer-signoff"><div><span className="wordmark footer-mark">Taste of Nawlins</span><p>New Orleans food, wherever we pull up.</p></div><a className="back-top" href="#top">Back to top ↗</a></div>
        <div className="footer-meta-row"><span>Washington social-purpose company in development</span><span>© 2026 Taste of Nawlins</span></div>
      </footer>
    </main>
  )
}
