import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'

const menu = [
  { name: 'Beignets', note: 'Pillowy squares of fried dough, served hot under a generous snowfall of powdered sugar.', price: 'Coming soon' },
  { name: 'Chicory Coffee', note: 'Dark-roasted coffee cut with roasted chicory for a deep, earthy cup with a smooth caramel finish.', price: 'Coming soon' },
  { name: 'Red Beans', note: 'Slow-simmered red beans with Creole seasoning, warm spice and a rich, savory finish.', price: 'Coming soon' },
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
        <label>Name<input name="name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
      </div>
      <div className="field-pair">
        <label>Phone<input name="phone" type="tel" /></label>
        <label>Event date<input name="eventDate" type="date" /></label>
      </div>
      <div className="field-pair">
        <label>Guest count<input name="guestCount" type="number" min="1" /></label>
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
    const nodes = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

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
        <div className="hero-image" role="img" aria-label="Taste of Nawlins community table photograph" />
        <div className="hero-copy hero-enter">
          <p className="eyebrow">New Orleans · Pacific Northwest</p>
          <h1>New Orleans food,<br />wherever we pull up.</h1>
          <p className="hero-deck">Beignets · Chicory coffee · Red beans</p>
          <a className="primary-link" href="#menu">See what’s cooking</a>
        </div>
      </section>

      <section className="next-drop" aria-label="Next service drop">
        <div className="drop-kicker">
          <span className="eyebrow">Next drop</span>
          <strong>Coming soon</strong>
        </div>
        <div className="drop-meta">
          <span>Beignets + chicory coffee</span>
          <span>Location announcing soon</span>
        </div>
        <a href="#follow">Follow the kitchen →</a>
      </section>

      <section className="menu-section" id="menu" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">The menu</p>
          <h2>Simple Classics</h2>
          <p>3 delicious New Orleans staples, every day.</p>
        </div>
        <div className="menu-list">
          {menu.map((item, index) => (
            <article className="menu-row" key={item.name}>
              <span className="menu-index">0{index + 1}</span>
              <div><h3>{item.name}</h3><p>{item.note}</p></div>
              <span className="menu-price">{item.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="story-statement" aria-label="Taste of Nawlins story" data-reveal>
        <p className="eyebrow">Food · people · purpose</p>
        <blockquote>Taste of Nawlins is a pop up kitchen with a purpose</blockquote>
      </section>

      <section className="boxing-section" id="boxing" data-reveal>
        <div className="boxing-title">
          <p className="eyebrow">A recurring community event</p>
          <h2>Boxing<br />& Beignets</h2>
        </div>
        <div className="boxing-copy">
          <h3>Food. Fighters. Mentorship.</h3>
          <p>Taste of Nawlins supports youth through boxing and mentorship. Boxing & Beignets is the recurring event where the food business and the mission meet through interviews, community partners and fundraising.</p>
          <div className="inline-links"><a href="#follow">Get the next date</a><a href="#catering">Partner with us</a></div>
        </div>
      </section>

      <section className="catering-section" id="catering" data-reveal>
        <div className="section-heading compact">
          <p className="eyebrow">Catering</p>
          <h2>Bring Nawlins<br />to the table.</h2>
          <p>Small gatherings, community events and pop-ups. Tell us what you’re planning.</p>
        </div>
        <PreviewForm type="catering" />
      </section>

      <section className="follow-section" id="follow" data-reveal>
        <div>
          <p className="eyebrow">Follow the kitchen</p>
          <h2>Know where we’re<br />cooking next.</h2>
        </div>
        <PreviewForm type="email" />
      </section>

      <footer className="editorial-footer" data-reveal>
        <div className="footer-topline">
          <span className="eyebrow">Stay close</span>
          <span className="footer-location">New Orleans soul · Pacific Northwest</span>
        </div>

        <div className="footer-social" aria-label="Social media">
          <a className="social-word social-instagram" href="#top" aria-label="Instagram placeholder">
            <span>Instagram</span><FontAwesomeIcon icon={faInstagram} />
          </a>
          <a className="social-word social-facebook" href="#top" aria-label="Facebook placeholder">
            <span>Facebook</span><FontAwesomeIcon icon={faFacebookF} />
          </a>
        </div>

        <div className="footer-signoff">
          <div>
            <span className="wordmark footer-mark">Taste of Nawlins</span>
            <p>New Orleans food, wherever we pull up.</p>
          </div>
          <a className="back-top" href="#top">Back to top ↗</a>
        </div>

        <div className="footer-meta-row">
          <span>Washington social-purpose company in development</span>
          <span>© 2026 Taste of Nawlins</span>
        </div>
      </footer>
    </main>
  )
}
