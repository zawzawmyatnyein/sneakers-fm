export default class Carousel {
  #contents
  #slides
  #prevButton
  #nextButton
  #liveregion

  constructor(container) {
    this.#contents = container.querySelector('.mobile--carousel-contents')
    this.#slides = [...container.querySelectorAll('.mobile--carousel-slide')]
    this.#prevButton = container.querySelector('.mobile--carousel-prev')
    this.#nextButton = container.querySelector('.mobile--carousel-next')
    this.#liveregion = container.querySelector('[role="status"]')

    this.#setSlidePositions()

    this.#prevButton.addEventListener('click', this.showPreviousSlide)
    this.#nextButton.addEventListener('click', this.showNextSlide)
  }

  #setSlidePositions() {
    const slideWidth = this.#slides[0].getBoundingClientRect().width
    this.#slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + 'px'
    })
  }

  get currentSlideIndex() {
    const currentSlide = this.#contents.querySelector('.visible')
    return this.#slides.findIndex(slide => slide === currentSlide)
  }

  switchSlide(currentSlideIndex, targetSlideIndex) {
    const currentSlide = this.#slides[currentSlideIndex]
    const targetSlide = this.#slides[targetSlideIndex]

    // switch to the correct slide
    const destination = getComputedStyle(targetSlide).left
    this.#contents.style.transform = `translateX(-${destination})`
    currentSlide.classList.remove('visible')
    currentSlide.classList.add('invisible')
    targetSlide.classList.remove('invisible')
    targetSlide.classList.add('visible')

    // show/hide next/prev buttons
    if (targetSlideIndex === 0) {
      this.#prevButton.setAttribute('disabled', 'true')
      this.#nextButton.removeAttribute('disabled')
      this.#nextButton.focus()
    } else if (targetSlideIndex === this.#slides.length - 1) {
      this.#prevButton.removeAttribute('disabled')
      this.#nextButton.setAttribute('disabled', 'true')
      this.#prevButton.focus()
    } else {
      this.#prevButton.removeAttribute('disabled')
      this.#nextButton.removeAttribute('disabled')
    }

    // Announce selectd slide to screen reader
    this.#liveregion.textContent = `Slide ${targetSlideIndex + 1} of ${this.#slides.length} selected`
  }

  showNextSlide = () => {
    const currentSlideIndex = this.currentSlideIndex
    let nextSlideIndex = currentSlideIndex + 1

    if (nextSlideIndex > this.#slides.length - 1) nextSlideIndex = this.#slides.length - 1

    this.switchSlide(currentSlideIndex, nextSlideIndex)
  }

  showPreviousSlide = () => {
    const currentSlideIndex = this.currentSlideIndex
    let previousSlideIndex = currentSlideIndex - 1

    if (previousSlideIndex < 0) previousSlideIndex = 0

    this.switchSlide(currentSlideIndex, previousSlideIndex)
  }
}
