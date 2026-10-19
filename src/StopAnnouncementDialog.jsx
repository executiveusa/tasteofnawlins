import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function StopAnnouncementDialog({ onDismiss, opener }) {
  const dialog = useRef(null)
  const title = useRef(null)
  const [message, setMessage] = useState('')
  useEffect(() => {
    const node = dialog.current
    const previousOverflow = document.body.style.overflow
    node.showModal()
    title.current.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      node.close()
      document.body.style.overflow = previousOverflow
      opener.current?.focus()
    }
  }, [opener])

  const keepFocusInside = (event) => {
    if (event.key !== 'Tab') return
    const controls = [...dialog.current.querySelectorAll('button, input, a[href]')]
    const first = controls[0], last = controls[controls.length - 1]
    if (event.shiftKey && [first, title.current, dialog.current].includes(document.activeElement)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const prepareRequest = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const phone = form.elements.phone
    phone.setCustomValidity('')
    const digits = phone.value.replace(/\D/g, '')
    if (digits.length < 7 || digits.length > 15) {
      phone.setCustomValidity('Enter a phone number with 7–15 digits. Include your country code.')
      phone.reportValidity()
      return
    }
    const data = new FormData(form)
    const texts = data.has('texts')
    const raffle = data.has('raffle')
    if (!texts && !raffle) {
      setMessage('Choose text alerts, a raffle entry request, or both.')
      return
    }
    const body = [
      'Taste of Nawlins — pop-up updates and raffle request',
      '',
      'Phone: ' + phone.value.trim(),
      'Text alert consent: ' + (texts ? 'Yes — upcoming Taste of Nawlins pop-up announcements.' : 'No — do not subscribe me to text alerts.'),
      'Free-gift raffle entry requested: ' + (raffle ? 'Yes — please send the rules and confirm my entry.' : 'No'),
      '',
      'Please confirm my requested signup or entry. I understand this email is a request, not an automatic signup or raffle entry.',
    ].join('\n')
    setMessage('Your email app should open. Press Send there. Your text signup and raffle entry are not confirmed until the kitchen responds. If it does not open, email glen@tasteofnawlins.food.')
    window.location.href = 'mailto:glen@tasteofnawlins.food?subject=' + encodeURIComponent('Pop-up text alerts & free-gift raffle request') + '&body=' + encodeURIComponent(body)
  }

  return createPortal(
    <dialog ref={dialog} className="stop-announcement-dialog" aria-labelledby="stop-dialog-title" aria-describedby="stop-dialog-description"
      onKeyDown={keepFocusInside} onCancel={(event) => { event.preventDefault(); onDismiss() }}>
      <button className="stop-dialog-close" type="button" onClick={onDismiss} aria-label="Close announcement popup">Close <span aria-hidden="true">×</span></button>
      <p className="stop-dialog-eyebrow">Be first to know</p>
      <h2 id="stop-dialog-title" tabIndex="-1" ref={title}>The next stop has not been announced yet.</h2>
      <p id="stop-dialog-description">Want a text when we announce the next pop-up? You can also request entry in a raffle to win a free gift from Taste of Nawlins.</p>
      <form onSubmit={prepareRequest}>
        <label className="stop-phone-label" htmlFor="stop-alert-phone">Mobile phone number</label>
        <input id="stop-alert-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength="32" required
          placeholder="Include country code" onInput={(event) => event.currentTarget.setCustomValidity('')} />
        <label className="stop-opt-in"><input name="texts" type="checkbox" />
          <span>I agree to receive text alerts from Taste of Nawlins about upcoming pop-ups. Message and data rates may apply. I can ask the kitchen to stop messages at any time.</span>
        </label>
        <label className="stop-opt-in"><input name="raffle" type="checkbox" />
          <span>I’d like to request entry in the free-gift raffle. Please send me the rules and confirm my entry.</span>
        </label>
        <p className="stop-request-note">Text alerts are optional for the raffle request. This opens an email to the kitchen; it does not automatically subscribe you or enter you in the raffle.</p>
        <button className="stop-request-submit" type="submit">Prepare my request <span aria-hidden="true">↗</span></button>
        <p className="stop-request-status" role="status">{message}</p>
      </form>
      <a className="stop-dialog-instagram" href="https://www.instagram.com/tasteofnawlins.food/" target="_blank" rel="noopener noreferrer">Or check our Instagram ↗</a>
    </dialog>, document.body,
  )
}
