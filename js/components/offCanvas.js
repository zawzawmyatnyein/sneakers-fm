import trapFocus from '../utilities/trapFocus'
import Focusable from '../utilities/focusable'

export default function OffCanvas({ overlay, openButton }) {
  const overlayElement = overlay
  const containerElement = overlay.querySelector('.offcanvas--container')
  const openButtonElement = openButton
  const closeButtonElement = containerElement.querySelector('.offcanvas--close-btn')

  function handleFocus(event) {
    trapFocus(containerElement, event)
  }

  function getSiblingElements() {
    return [...overlayElement.parentElement.children].filter(el => el !== overlay)
  }

  function showSiblingElements() {
    getSiblingElements().forEach(el => el.removeAttribute('aria-hidden'))
  }

  function hideSiblingElements() {
    getSiblingElements().forEach(el => el.setAttribute('aria-hidden', true))
  }

  const offcanvas = {
    isOpen() {
      return overlayElement.classList.contains('overlay--open')
    },
    open() {
      overlayElement.classList.remove('overlay--close')
      containerElement.classList.remove('offcanvas--close')
      overlayElement.classList.add('overlay--open')
      containerElement.classList.add('offcanvas--open')
      openButtonElement.setAttribute('aria-expanded', true)
      document.body.classList.add('overflow-hidden')
      document.addEventListener('keydown', handleFocus)
      hideSiblingElements()

      // autofocus
      const { keyboardOnly } = Focusable(containerElement)
      if (keyboardOnly[0]) keyboardOnly[0].focus()
    },
    close() {
      overlayElement.classList.remove('overlay--open')
      containerElement.classList.remove('offcanvas--open')
      overlayElement.classList.add('overlay--close')
      containerElement.classList.add('offcanvas--close')
      openButtonElement.setAttribute('aria-expanded', false)
      document.body.classList.remove('overflow-hidden')
      document.removeEventListener('keydown', handleFocus)
      showSiblingElements()

      openButtonElement.focus()
    }
  }

  closeButtonElement.addEventListener('click', () => offcanvas.close())

  overlayElement.addEventListener('click', event => {
    if (!event.target.closest('.offcanvas--container')) offcanvas.close()
  })

  document.addEventListener('keydown', event => {
    if (offcanvas.isOpen() && event.key === 'Escape') offcanvas.close()
  })

  return { ...offcanvas }
}
