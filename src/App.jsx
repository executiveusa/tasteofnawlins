import React, { useEffect } from 'react'
import './photo-quality.css'
import './signature.css'
import { galleryMedia } from './gallery-media.js'
import ScrapbookPage from './ScrapbookPage.jsx'

const menu = [
  { name: 'Beignets', note: 'Pillowy squares of fried dough, served hot under a generous snowfall of powdered sugar.', price: 'Coming soon' },
  { name: 'Café du Monde’s Original Chicory Coffee', note: 'The original 15 oz. Café du Monde dark-roasted coffee and chicory blend, a New Orleans classic.', price: 'Coming soon' },
  { name: 'Red Beans & Rice', note: 'Tender red beans slow-simmered with onion, garlic, and Creole seasoning, served over fluffy white rice.', price: 'Coming soon' },
  { name: 'Cornbread', note: 'Golden-edged and tender-crumbed, with a touch of sweetness and a rich, buttery finish.', price: 'Coming soon' },
  { name: 'Cabbage', note: 'Slow-cooked cabbage with onion, garlic and Creole seasoning—tender, savory and full of flavor.', price: 'Coming soon' },
  { name: 'Chicken & Acadia Style Sausage Gumbo', note: 'Chicken and Acadia-style sausage simmered low and slow in a rich, deeply seasoned gumbo.', price: 'Coming soon' },
]

const photoSet = (name, widths) => widths.map((width) => `/images/${name}-${width}.webp ${width}w`).join(', ')
const galleryWidths = (name) => name === 'table' ? [1280, 1920, 2880, 3840] : [720, 1440, 2400]

const storyFrames = [
  { name: 'counter', className: 'story-frame-counter', width: 4504, height: 6006, alt: 'Taste of Nawlins food being handed across a neighborhood counter' },
  { name: 'first-taste', className: 'story-frame-first-taste', width: 3616, height: 5430, alt: 'A customer holding a Taste of Nawlins food container' },
  { name: 'walmart', className: 'story-frame-walmart', width: 2880, height: 5120, alt: 'A worker holding a Taste of Nawlins food container' },
  { name: 'table', className: 'story-frame-table', width: 6070, height: 4928, alt: 'People gathered around a table with Taste of Nawlins food' },
]


const signatureFAQs = [
  { question: 'What coffee do you serve?', answer: 'We serve Café du Monde’s Original Chicory Coffee, a dark-roasted New Orleans blend. The exact drink options will be announced with each pop-up.' },
  { question: 'What are beignets?', answer: 'Beignets are squares of fried dough, traditionally served hot and generously covered in powdered sugar.' },
  { question: 'What is chicory?', answer: 'Chicory comes from the roasted root of the endive plant. Blended with coffee, it gives the cup a fuller, distinctive flavor.' },
  { question: 'Does coffee and chicory contain caffeine?', answer: 'Yes. Chicory itself contains no caffeine, but Café du Monde’s Original Chicory Coffee contains coffee.' },
  { question: 'Is café au lait an option?', answer: 'Café au lait is the traditional combination of coffee and hot milk. We will announce preparation options before service.' },
  { question: 'Are the beignets gluten-free?', answer: 'Traditional beignets contain wheat flour. Ask the team about the specific ingredients and allergens at your pop-up before ordering.' },
  { question: 'Where can I find Chicory Coffee & Beignets?', answer: 'Taste of Nawlins is a traveling kitchen. Follow our next-drop announcements for the date, location, and availability.' },
]

function SignaturePage() {
  useEffect(() => {
    document.title = 'Chicory Coffee & Beignets | Taste of Nawlins'
    return () => { document.title = 'Taste of Nawlins' }
  }, [])
  return (
    <main className="signature-page">
      <header className="signature-header">
        <a className="wordmark" href="/" aria-label="Taste of Nawlins home">Taste of Nawlins</a>
        <nav aria-label="Signature page navigation"><a href="/taste-of-nawlins-menu.html">Full menu</a><a href="/taste-of-nawlins-menu.html" download>Save menu</a><a href="#history">Our tradition</a><a href="#faq">FAQ</a></nav>
      </header>
      <section className="signature-hero" aria-labelledby="signature-title">
        <p className="eyebrow">The signature pairing · New Orleans tradition</p>
        <h1 id="signature-title">Chicory Coffee <em>&</em><br />Beignets.</h1>
        <p className="signature-lede">Hot, powdered-sugar beignets. Café du Monde’s Original Chicory Coffee. Two New Orleans classics, served together.</p>
        <a className="signature-cta" href="/#follow">Find our next pop-up <span aria-hidden="true">↗</span></a>
        <div className="signature-hero-footer" aria-hidden="true"><span>Hot beignets</span><span>Dark roast & chicory</span><span>New Orleans soul</span></div>
      </section>
      <section className="signature-pair" aria-label="What we serve">
        <div className="signature-pair-copy">
          <p className="eyebrow">The pairing</p><h2>Powdered sugar.<br />Dark roast.<br /><em>No shortcuts.</em></h2>
          <p>Our beignets meet the real Café du Monde’s Original Chicory Coffee blend—the recognizable New Orleans 15-ounce can you know. Enjoy the tradition at a Taste of Nawlins pop-up.</p>
          <p className="signature-disclosure">Café du Monde is the coffee brand we serve, not the sponsor of Taste of Nawlins or Boxing & Beignets.</p>
        </div>
        <div className="signature-product" aria-label="Café du Monde’s Original Chicory Coffee product">
          <div className="signature-product-art" role="img" aria-label="Product image pending: Café du Monde’s Original Chicory Coffee 15 ounce can">
            <span className="signature-product-top">THE COFFEE WE SERVE</span>
            <strong>Café du Monde</strong>
            <span>COFFEE & CHICORY</span>
            <small>15 OZ. · ORIGINAL NEW ORLEANS BLEND</small>
          </div>
          <p className="signature-caption">Actual Café du Monde’s Original Chicory Coffee · 15 oz. can. Product photograph pending; this is a temporary illustration, not an actual product photo.</p>
        </div>
      </section>
      <section className="signature-history" id="history">
        <div><p className="eyebrow">A New Orleans tradition</p><h2>Made to be<br />enjoyed together.</h2></div>
        <div className="signature-history-body">
          <p>Coffee and beignets have long shared a table in New Orleans. The city’s dark-roasted coffee and chicory became a distinctive local taste, while beignets—square pieces of fried dough covered in powdered sugar—became a beloved treat.</p>
          <p>Café du Monde opened its French Market coffee stand in 1862. Its coffee-and-chicory blend, enjoyed black or as café au lait with hot milk, remains part of that tradition. We bring the same pairing to our traveling table.</p>
          <p className="signature-source">Historical reference: <a href="https://shop.cafedumonde.com/history/" target="_blank" rel="noopener noreferrer">Café du Monde's official history ↗</a></p>
        </div>
      </section>
      <section className="signature-boxing" id="boxing">
        <p className="eyebrow">Where the table meets the ring</p>
        <h2>Boxing <em>&</em><br />Beignets.</h2>
        <p>It starts with a familiar New Orleans tradition: coffee, beignets, and a reason to sit down together. Boxing & Beignets carries that spirit into conversations with fighters, coaches, and neighbors about the young people coming up behind them.</p>
        <div className="signature-purpose">
          <p className="eyebrow">The purpose beyond the plate</p>
          <h3>Good food opens the conversation. Mentorship gives it somewhere to go.</h3>
          <p>Future Champs focuses on youth boxing and mentorship. Taste of Nawlins brings the food; Boxing & Beignets brings people to the table; Future Champs is where visitors can learn about the work with young athletes. Each has a distinct role, connected by the same community.</p>
          <a className="signature-cta" href="https://futurechampsgym.com/" target="_blank" rel="noopener noreferrer" aria-label="Discover Future Champs youth boxing and mentorship (opens a new website)">Discover Future Champs <span aria-hidden="true">↗</span></a>
          <p className="signature-purpose-note">Future Champs is a separate organization. Coffee and beignet purchases are not represented as charitable donations.</p>
        </div>
      </section>
      <section className="signature-faq" id="faq"><div><p className="eyebrow">Good to know</p><h2>Frequently asked<br />questions.</h2></div>
        <div className="signature-questions">{signatureFAQs.map(({question,answer}) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>
      <footer className="signature-end"><p className="eyebrow">Find us around town</p><h2>Come hungry.<br />Leave with a story.</h2><a className="signature-cta" href="/#follow">Follow the kitchen <span aria-hidden="true">↗</span></a><a className="signature-back" href="/">← Back to Taste of Nawlins</a></footer>
    </main>
  )
}

function GuestGallery() {
  return (
    <section className="guest-gallery" id="gallery" aria-labelledby="guest-gallery-title">
      <div className="guest-gallery-heading">
        <p className="eyebrow">At the table</p>
        <h2 id="guest-gallery-title">Thank you for being<br />part of our story!</h2>
        <p>From the first bite to the last conversation. These moments belong to the people who shared them with us.</p>
      </div>
      <a className="guest-gallery-view-all" href="/gallery">Open our scrapbook — all photographs &amp; film clips ↗</a>
      <div className="guest-gallery-grid">
        {galleryMedia.filter((item) => item.kind === 'photo' && ['counter', 'first-taste', 'walmart', 'table'].includes(item.id)).map((item) => (
          <figure className={`guest-media guest-media-${item.kind}`} key={item.id}>
            {item.kind === 'video' ? (
              <video controls playsInline preload="none" poster={item.poster} aria-label={item.caption}>
                <source src={item.src} type={item.src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
                {item.captionsSrc && <track src={item.captionsSrc} kind="captions" srcLang="en" label="English" default />}
                Your browser cannot play this video.
              </video>
            ) : (
              <a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Open photo: ${item.alt}`}>
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              </a>
            )}
            <figcaption>{item.caption}{item.kind === 'video' && <span> · Watch clip</span>}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function ContactForm({ type }) {
  const isCatering = type === 'catering'
  const [status, setStatus] = React.useState('')
  const onSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const data = new FormData(form)
    const get = (key) => String(data.get(key) || '').trim()
    const subject = isCatering ? 'Taste of Nawlins — Catering inquiry' : 'Taste of Nawlins — Pop-up updates request'
    const body = isCatering
      ? [
          'Name: ' + get('name'),
          'Email: ' + get('email'),
          'Phone: ' + get('phone'),
          'Event date: ' + get('eventDate'),
          'Guest count: ' + get('guestCount'),
          'Pickup or delivery: ' + get('fulfillment'),
          '',
          'Event details:',
          get('notes'),
        ].join('\\n')
      : ['Please add me to your pop-up announcement list.', '', 'Email: ' + get('email')].join('\\n')
    const url = 'mailto:glen@tasteofnawlins.food?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body)
    setStatus('Your email app should open with a prepared message. Please press Send there to deliver your request.')
    window.location.href = url
  }
  if (!isCatering) {
    return (
      <form className="signup-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="Email address" required />
        <button type="submit">Request pop-up updates</button>
        <p className="form-note" aria-live="polite">{status || 'Opens a prepared email to our kitchen. No automatic subscription or storage.'}</p>
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
      <button type="submit">Prepare catering request</button>
      <p className="form-note" aria-live="polite">{status || 'This opens a prepared email to Glen. You must press Send in your email app; no request is stored on the website.'}</p>
      <p className="form-note">Or write directly to <a href="mailto:glen@tasteofnawlins.food?subject=Taste%20of%20Nawlins%20Catering">glen@tasteofnawlins.food</a>.</p>
    </form>
  )
}

export default function App() {
  const isSignaturePage = ['/coffee-and-beignets', '/coffee-and-beignets/'].includes(window.location.pathname)
  const isScrapbookPage = ['/gallery', '/gallery/'].includes(window.location.pathname)
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

  if (isSignaturePage) return <SignaturePage />
  if (isScrapbookPage) return <ScrapbookPage />

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Taste of Nawlins home">Taste of Nawlins</a>
        <nav aria-label="Primary navigation">
          <a href="/taste-of-nawlins-menu.html">Menu</a>
          <a href="/coffee-and-beignets">Chicory Coffee & Beignets</a>
          <a href="/gallery">Scrapbook</a>
          <a href="#catering">Catering</a>
          <a href="#boxing">Boxing & Beignets</a>
        </nav>
      </header>
      <section className="hero" id="top">
        <picture className="hero-image">
          <img src="/images/table-1920.webp" srcSet={photoSet('table', [1280, 1920, 2880, 3840])} sizes="100vw" width="6070" height="4928" alt="Taste of Nawlins founder wearing his medal at a community table with two veterans" loading="eager" decoding="async" fetchPriority="high" />
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
      <section className="signature-home" aria-label="Signature Coffee and Beignets">
        <div className="signature-home-copy"><p className="eyebrow">The signature pairing</p><h2>Chicory Coffee <em>&</em><br />Beignets.</h2><p>Our hot beignets meet Café du Monde’s Original Chicory Coffee—a New Orleans tradition and the heart of Boxing & Beignets.</p><a href="/coffee-and-beignets">Discover the tradition <span aria-hidden="true">↗</span></a></div>
        <div className="signature-home-stamp" aria-hidden="true"><span>BEIGNETS</span><strong>&</strong><span>CHICORY COFFEE</span></div>
      </section>
      <section className="menu-section" id="menu">
        <div className="section-heading" data-motion="quiet">
          <p className="eyebrow">The menu</p><h2>New Orleans Classics</h2><p>New Orleans favorites, served wherever the kitchen pulls up. Availability and pricing announced before each pop-up.</p><a className="menu-download" href="/taste-of-nawlins-menu.html">See the full menu ↗</a><a className="menu-download" href="/taste-of-nawlins-menu.html" download="taste-of-nawlins-menu.html">Download menu ↓</a>
        </div>
        <div className="menu-list" data-motion="rows">
          {menu.map((item, index) => (
            <article className="menu-row" key={item.name} style={{ '--row': index }}>
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
            </figure>
          ))}
        </div>
      </section>
      <GuestGallery />
      <section className="story-statement" aria-label="Taste of Nawlins story">
        <p className="eyebrow" data-motion="quiet">Our beginning</p>
        <blockquote data-motion="statement">It started with a dollar and a dream. Now we get to share the table.</blockquote>
      </section>
      <section className="boxing-section" id="boxing">
        <div className="boxing-title" data-motion="quiet"><p className="eyebrow">A recurring community event</p><h2>Boxing<br />& Beignets</h2></div>
        <div className="boxing-copy" data-motion="quiet">
          <h3>Food. Fighters. Mentorship.</h3>
          <p>Boxing & Beignets connects our signature coffee-and-beignets tradition with local conversations about boxing, mentorship and the community work done by local gyms in the Pacific Northwest. To learn more about our social purpose project, Future Champs, <a href="https://futurechampsgym.com/" target="_blank" rel="noopener noreferrer">click here</a>.</p>
          <div className="inline-links"><a href="/coffee-and-beignets">Discover Chicory Coffee & Beignets</a><a href="#follow">Get the next date</a><a href="#catering">Partner with us</a></div>
        </div>
      </section>
      <section className="catering-section" id="catering">
        <div className="section-heading compact" data-motion="quiet"><p className="eyebrow">Catering</p><h2>Bring Nawlins<br />to the table.</h2><p>Small gatherings, community events and pop-ups. Tell us what you’re planning.</p></div>
        <div data-motion="quiet"><ContactForm type="catering" /></div>
      </section>
      <section className="follow-section" id="follow">
        <div data-motion="quiet"><p className="eyebrow">Follow the kitchen</p><h2>Know where we’re<br />cooking next.</h2></div>
        <div data-motion="quiet"><ContactForm type="email" /></div>
      </section>
      <footer className="editorial-footer">
        <div className="footer-topline"><span className="eyebrow">Stay close</span><span className="footer-location">New Orleans soul · Pacific Northwest</span></div>
        <div className="footer-social" aria-label="Social media" data-motion="footer">
          <a className="social-word social-instagram" href="https://www.instagram.com/tasteofnawlins.food/" aria-label="Taste of Nawlins on Instagram" target="_blank" rel="noopener noreferrer"><span>Instagram</span><b aria-hidden="true">↗</b></a>
          <a className="social-word social-facebook" href="mailto:glen@tasteofnawlins.food?subject=Taste%20of%20Nawlins" aria-label="Email Taste of Nawlins"><span>Email the kitchen</span><b aria-hidden="true">↗</b></a>
        </div>
        <div className="footer-signoff"><div><span className="wordmark footer-mark">Taste of Nawlins</span><p>New Orleans food, wherever we pull up.</p></div><a className="back-top" href="#top">Back to top ↗</a></div>
        <div className="footer-meta-row"><span>Pop-up kitchen · Pacific Northwest</span><span>© 2026 Taste of Nawlins</span></div>
      </footer>
    </main>
  )
}
