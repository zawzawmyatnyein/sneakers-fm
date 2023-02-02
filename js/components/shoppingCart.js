import { currencyFormatter } from '../utilities/formatter'
import { get as getStorage, set as setStorage } from '../utilities/localStorage'
import Focusable from '../utilities/focusable'

export default class ShoppingCart {
  #containerElement
  #toggleBtn
  #contents
  items = []

  constructor(container, btn) {
    this.#containerElement = container
    this.#toggleBtn = btn
    this.#contents = container.querySelector('.cart--contents')

    // Initialize cart
    this.items = getStorage('cart') || []
    this.#toggleBtn.querySelector('span').textContent = this.itemsQuantity || ''
    this.#render()

    // Add event listeners
    document.addEventListener('keydown', this.#handleFocus)
    this.#contents.addEventListener('click', this.#handleDelete)
  }

  get isOpen() {
    return this.#containerElement.classList.contains('cart--open')
  }

  toggle() {
    this.#containerElement.classList.toggle('cart--close')
    this.#containerElement.classList.toggle('cart--open')

    if (this.isOpen) {
      this.#toggleBtn.setAttribute('aria-expanded', true)
      this.#toggleBtn.setAttribute('aria-label', 'Close shopping cart')
    } else {
      this.#toggleBtn.setAttribute('aria-expanded', false)
      this.#toggleBtn.setAttribute('aria-label', 'Open shopping cart')
    }
  }

  get itemsQuantity() {
    return this.items.reduce((acc, cur) => acc + cur.qty, 0)
  }

  addItem(item) {
    this.#hasItem(item) ? this.#updateItemQuantity(item) : this.#pushItem(item)
    this.#render()
    this.#toggleBtn.querySelector('span').textContent = this.itemsQuantity
    setStorage('cart', this.items)
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id)
  }

  #hasItem(item) {
    return this.items.some(el => el.id === item.id)
  }

  #pushItem(item) {
    this.items = [...this.items, item]
  }

  #updateItemQuantity(item) {
    this.items = this.items.map(el => {
      if (el.id === item.id) el.qty += item.qty
      return el
    })
  }

  // Listener callbacks
  #handleFocus = e => {
    const { firstFocusable, lastFocusable } = Focusable(this.containerElement)
    if (!firstFocusable || !lastFocusable) return

    if (e.target === this.toggleBtn && e.key === 'Tab' && !e.shiftKey && this.isOpen()) {
      e.preventDefault()
      firstFocusable.focus()
    }

    if (document.activeElement === firstFocusable && e.key === 'Tab' && e.shiftKey) {
      e.preventDefault()
      this.#toggleBtn.focus()
    }

    if (document.activeElement === lastFocusable && e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      this.#toggleBtn.nextElementSibling.focus()
    }
  }

  #handleDelete = e => {
    if (!e.target.closest('.cart--delete')) return

    const id = parseInt(e.target.closest('.cart--delete').dataset.id)
    this.removeItem(id)
    this.#render()
    this.#toggleBtn.querySelector('span').textContent = this.itemsQuantity || ''
    setStorage('cart', this.items)
  }

  #render() {
    this.#contents.innerHTML = ''
    const markup = this.#generateMarkup()
    this.#contents.insertAdjacentHTML('afterbegin', markup)
  }

  // prettier-ignore
  #generateMarkup() {
    if (!this.items.length) {
      return `
            <div class="px-20 py-16 text-center font-bold text-dark-gray-blue">Your cart is empty.</div>
        `
    }

    return `
        <ul class="space-y-6">
            ${this.items
              .map(
                item =>
                  `
                    <li class="flex justify-between items-center gap-x-4">
                        <a href="#" class="flex items-center gap-x-4 rounded-sm outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange">
                            <img class="w-12 h-12 rounded-lg" src="${item.imgUrl}" alt="${item.name}">
                            <div class="space-y-1">
                                <div class="text-dark-gray-blue">${item.name}</div>
                                <div class="space-x-2">
                                    <span class="text-dark-gray-blue">${currencyFormatter(item.price)} x ${item.qty}</span>
                                    <span class="font-bold">${currencyFormatter(item.price * item.qty)}</span>
                                </div>
                            </div>
                        </a>
                        <button data-id="${item.id}" class="cart--delete self-stretch px-2 rounded-sm outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange"><img aria-hidden="true" src="/images/icon-delete.svg"></button>
                    </li>
                `
              )
              .join('')}
        </ul>
        <a href="#" class="block w-full py-4 text-white text-center font-bold bg-orange hover:bg-orange/70 rounded-lg outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange">Checkout</a>
    `
  }
}
