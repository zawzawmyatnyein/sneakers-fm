import Focusable from '../utilities/focusable'
import trapFocus from '../utilities/trapFocus'

export default class LightBox {
  constructor(overlayElement) {
    this.overlay = overlayElement
    this.openButton = document.querySelector('.lightbox--open')
    this.container = overlayElement.querySelector('.lightbox--container')
    this.closeButton = overlayElement.querySelector('.lightbox--close')
    this.carousel = overlayElement.querySelector('.lightbox--carousel')
    this.carouselContents = overlayElement.querySelector('.lightbox--carousel-contents')
    this.carouselSlides = [...overlayElement.querySelectorAll('.lightbox--carousel-slide')]
    this.carouselPrevButton = overlayElement.querySelector('.lightbox--carousel-prev')
    this.carouselNextButton = overlayElement.querySelector('.lightbox--carousel-next')
    this.carouselDotsContainer = overlayElement.querySelector('.lightbox--carousel-dots-container')
    this.carouselDots = [...overlayElement.querySelectorAll('.lightbox--carousel-dots')]
    this.liveregion = overlayElement.querySelector('[role="status"]')

    this.setSlidePositions()

    this.carouselPrevButton.addEventListener('click', this.showPreviousSlide.bind(this))
    this.carouselNextButton.addEventListener('click', this.showNextSlide.bind(this))
    this.carouselDotsContainer.addEventListener('click', this.handleClickOnDots.bind(this))
    document.addEventListener('keydown', this.handleKeydown.bind(this))

    this.closeButton.addEventListener('click', this.close.bind(this))
    this.overlay.addEventListener('click', this.handleClickOverlay.bind(this))
  }

  handleFocus(event) {
    trapFocus(this.container, event)
  }

  getSiblingElements() {
    return [...this.overlay.parentElement.children].filter(el => el !== this.overlay)
  }

  showSiblingElements() {
    this.getSiblingElements().forEach(el => el.removeAttribute('aria-hidden'))
  }

  hideSiblingElements() {
    this.getSiblingElements().forEach(el => el.setAttribute('aria-hidden', true))
  }

  get isOpen() {
    return this.overlay.classList.contains('visible')
  }

  handleClickOverlay(event) {
    if (!event.target.closest('.lightbox--carousel') && !event.target.closest('.lightbox--carousel-dots-container')) {
      this.close()
    }
  }

  open() {
    this.overlay.classList.remove('-z-20', 'opacity-0', 'invisible')
    this.overlay.classList.add('z-20', 'opacity-100', 'visible')
    this.container.classList.remove('-z-30', 'opacity-0', 'invisible')
    this.container.classList.add('z-30', 'opacity-100', 'visible')
    this.openButton.setAttribute('aria-expanded', true)
    document.body.classList.add('overflow-hidden')
    document.addEventListener('keydown', this.handleFocus.bind(this))
    this.hideSiblingElements()

    // autofocus
    const { firstFocusable } = Focusable(this.container)
    if (firstFocusable) firstFocusable.focus()
  }

  close() {
    this.overlay.classList.remove('z-20', 'opacity-100', 'visible')
    this.overlay.classList.add('-z-20', 'opacity-0', 'invisible')
    this.container.classList.remove('z-30', 'opacity-100', 'visible')
    this.container.classList.add('-z-30', 'opacity-0', 'invisible')
    this.openButton.setAttribute('aria-expanded', false)
    document.body.classList.remove('overflow-hidden')
    document.removeEventListener('keydown', this.handleFocus.bind(this))
    this.showSiblingElements()

    this.openButton.focus()
  }

  setSlidePositions() {
    const slideWidth = this.carouselSlides[0].getBoundingClientRect().width
    this.carouselSlides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + 'px'
    })
  }

  get currentSlideIndex() {
    const currentSlide = this.carouselContents.querySelector('.visible')
    return this.carouselSlides.findIndex(slide => slide === currentSlide)
  }

  switchSlide(currentSlideIndex, targetSlideIndex) {
    const currentSlide = this.carouselSlides[currentSlideIndex]
    const targetSlide = this.carouselSlides[targetSlideIndex]

    // switch to the correct slide
    const destination = getComputedStyle(targetSlide).left
    this.carouselContents.style.transform = `translateX(-${destination})`
    currentSlide.classList.remove('visible')
    currentSlide.classList.add('invisible')
    targetSlide.classList.remove('invisible')
    targetSlide.classList.add('visible')

    // show/hide next/prev buttons
    if (targetSlideIndex === 0) {
      this.carouselPrevButton.setAttribute('disabled', 'true')
      this.carouselNextButton.removeAttribute('disabled')
      this.carouselNextButton.focus()
    } else if (targetSlideIndex === this.carouselSlides.length - 1) {
      this.carouselPrevButton.removeAttribute('disabled')
      this.carouselNextButton.setAttribute('disabled', 'true')
      this.carouselPrevButton.focus()
    } else {
      this.carouselPrevButton.removeAttribute('disabled')
      this.carouselNextButton.removeAttribute('disabled')
    }

    // highlight the correct dot
    const currentDot = this.carouselDots[currentSlideIndex]
    const targetDot = this.carouselDots[targetSlideIndex]
    currentDot.classList.remove('border-orange', 'bg-white')
    currentDot.firstElementChild.classList.remove('opacity-50')
    targetDot.classList.add('border-orange', 'bg-white')
    targetDot.firstElementChild.classList.add('opacity-50')

    // Announce selectd slide to screen reader
    this.liveregion.textContent = `Slide ${targetSlideIndex + 1} of ${this.carouselSlides.length} selected`
  }

  showNextSlide() {
    const currentSlideIndex = this.currentSlideIndex
    let nextSlideIndex = currentSlideIndex + 1

    if (nextSlideIndex > this.carouselSlides.length - 1) nextSlideIndex = this.carouselSlides.length - 1

    this.switchSlide(currentSlideIndex, nextSlideIndex)
  }

  showPreviousSlide() {
    const currentSlideIndex = this.currentSlideIndex
    let previousSlideIndex = currentSlideIndex - 1

    if (previousSlideIndex < 0) previousSlideIndex = 0

    this.switchSlide(currentSlideIndex, previousSlideIndex)
  }

  handleClickOnDots(event) {
    const dot = event.target.closest('button')
    if (!dot) return

    const currentSlideIndex = this.currentSlideIndex
    const targetSlideIndex = this.carouselDots.findIndex(d => d === dot)
    this.switchSlide(currentSlideIndex, targetSlideIndex)
  }

  handleKeydown(event) {
    const { key } = event
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Escape') return

    if (!this.isOpen) return

    if (key === 'Escape') return this.close()

    const currentSlideIndex = this.currentSlideIndex
    let targetSlideIndex

    if (key === 'ArrowLeft') targetSlideIndex = currentSlideIndex - 1
    if (key === 'ArrowRight') targetSlideIndex = currentSlideIndex + 1

    if (targetSlideIndex < 0) targetSlideIndex = 0
    if (targetSlideIndex > this.carouselSlides.length - 1) targetSlideIndex = this.carouselSlides.length - 1

    this.switchSlide(currentSlideIndex, targetSlideIndex)
  }
}
