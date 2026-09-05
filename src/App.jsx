import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'

const menu = [
  { name: 'Beignets', note: 'Fresh · hot · powdered sugar', price: 'Coming soon' },
  { name: 'Chicory Coffee', note: 'New Orleans-style coffee', price: 'Coming soon' },
  { name: 'Red Beans', note: 'Slow-cooked · soulful · simple', price: 'Coming soon' },
]

function PreviewForm({ type }) {
  const onSubmit = (event) => {
    event.preventDefault()
    const box = event.currentTarget.querySelector('[data-preview-message]')
    if (box) box.textContent = 'Preview only — this form will be connected to live storage at deployment.'
  }

  if (type === 'email') {
    return (
      <form className="signup-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" placeholder="Email address" required />
        <button type="submit">Follow the kitchen</button>
        <p className="form-note" data-preview-message aria-live="polite">No spam. Just drops, menus and Boxing & Beignets dates.</p>
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
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Taste of Nawlins home">Taste of Nawlins</a>
        <nav aria-label="Primary navigation">
          <a href="#menu">Menu</a>
          <a href="#boxing">Boxing & Beignets</a>
          <a href="#catering">Catering</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-image" role="img" aria-label="Taste of Nawlins community food story photograph" />
        <div className="hero-copy">
          <p className="eyebrow">New Orleans · Pacific Northwest</p>
          <h1>New Orleans food,<br />wherever we pull up.</h1>
          <p className="hero-deck">Beignets. Chicory coffee. Red beans. A traveling kitchen with one permanent home.</p>
          <a className="primary-link" href="#menu">See today’s menu</a>
        </div>
      </section>

      <section className="next-drop" aria-label="Next service drop">
        <div>
          <span className="eyebrow">Next drop</span>
          <strong>Coming soon</strong>
        </div>
        <p>Beignets · Chicory Coffee · Red Beans</p>
        <a href="#follow">Follow the kitchen</a>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading">
          <p className="eyebrow">The menu</p>
          <h2>Small on purpose.</h2>
          <p>We start with the things we want to be known for and let the menu grow from what people actually come back for.</p>
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

      <section className="story-grid" aria-label="Taste of Nawlins story">
        <div className="story-photo story-photo-one" role="img" aria-label="Taste of Nawlins customer holding packaged food" />
        <blockquote>
          <p>Food first. Real people. Real places.</p>
          <cite>Taste of Nawlins is built to travel.</cite>
        </blockquote>
        <div className="story-photo story-photo-two" role="img" aria-label="Taste of Nawlins community customer photograph" />
        <div className="story-photo story-photo-three" role="img" aria-label="Taste of Nawlins gathering around a table" />
      </section>

      <section className="boxing-section" id="boxing">
        <div className="boxing-title">
          <p className="eyebrow">A recurring community pop-up</p>
          <h2>Boxing<br />& Beignets</h2>
        </div>
        <div className="boxing-copy">
          <h3>Food. Fighters. A reason to show up.</h3>
          <p>Every other week, Taste of Nawlins plans to pop up with beignets, coffee, conversations with fighters, and a community fundraiser supporting youth boxing and mentorship.</p>
          <p className="purpose-line">Our specific social purpose: support youth through boxing and mentorship, using food and community events to create access to positive coaching, discipline and opportunity.</p>
          <div className="inline-links"><a href="#follow">Get the next date</a><a href="#catering">Partner with us</a></div>
        </div>
      </section>

      <section className="catering-section" id="catering">
        <div className="section-heading compact">
          <p className="eyebrow">Catering</p>
          <h2>Bring Nawlins<br />to the table.</h2>
          <p>Small gatherings, community events and pop-ups. Tell us what you’re planning.</p>
        </div>
        <PreviewForm type="catering" />
      </section>

      <section className="follow-section" id="follow">
        <div>
          <p className="eyebrow">Follow the kitchen</p>
          <h2>Know where we’re<br />cooking next.</h2>
        </div>
        <PreviewForm type="email" />
      </section>

      <section className="impact-strip">
        <p className="eyebrow">Food with a job to do</p>
        <p>Boxing & Beignets is the mission-forward event supporting youth boxing and mentorship. Impact numbers will only be published when they are verified.</p>
        <a href="#top">Social purpose report · coming later</a>
      </section>

      <footer>
        <div>
          <span className="wordmark footer-mark">Taste of Nawlins</span>
          <p>New Orleans food, wherever we pull up.</p>
        </div>
        <div className="social-links" aria-label="Social media">
          <a href="#top" aria-label="Instagram placeholder"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#top" aria-label="Facebook placeholder"><FontAwesomeIcon icon={faFacebookF} /></a>
        </div>
        <p className="footer-meta">Washington social-purpose company in development · © 2026 Taste of Nawlins</p>
      </footer>
    </main>
  )
}
