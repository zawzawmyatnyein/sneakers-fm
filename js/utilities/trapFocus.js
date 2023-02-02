import Focusable from './focusable'

export default function trapFocus(element, event) {
  const { firstFocusable, lastFocusable } = Focusable(element)

  if (document.activeElement === lastFocusable && event.key === 'Tab' && !event.shiftKey) {
    event.preventDefault()
    firstFocusable.focus()
  }

  if (document.activeElement === firstFocusable && event.key === 'Tab' && event.shiftKey) {
    event.preventDefault()
    lastFocusable.focus()
  }
}
