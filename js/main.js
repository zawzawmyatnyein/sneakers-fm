import QuantitySpinner from './components/quantitySpinner'
import ShoppingCart from './components/shoppingCart'
import OffCanvas from './components/offCanvas'
import Carousel from './components/carousel'
import LightBox from './components/lightBox'

// Instantiate a quantity spinner
const spinner = QuantitySpinner(document.querySelector('.qty--container'))

// Instantiate a shopping cart
const cart = new ShoppingCart(document.querySelector('.cart--container'), document.querySelector('.cart--btn'))

// Open/close shopping cart
document.querySelector('.cart--btn').addEventListener('click', () => cart.toggle())

// Add items to cart
document.querySelector('#addToCart').addEventListener('click', () => {
  cart.addItem({
    id: 1,
    name: 'Fall Limited Edition Sneakers',
    price: 125,
    imgUrl: '/images/image-product-1-thumbnail.jpg',
    qty: spinner.quantity
  })
})

// Instantiate an Offcanvas mobile navigation
const offCanvas = OffCanvas({
  overlay: document.querySelector('.offcanvas--overlay'),
  openButton: document.querySelector('#mobile-menu')
})

document.querySelector('#mobile-menu').addEventListener('click', () => offCanvas.open())

// Instantiate a Carousel
const mobileCarousel = new Carousel(document.querySelector('.mobile--carousel'))

// Instantiat a LightBox Gallery
const lightBox = new LightBox(document.querySelector('.lightbox--overlay'))
document.querySelector('.lightbox--open').addEventListener('click', () => lightBox.open())

const thumbnailsContainer = document.querySelector('.gallery--thumbnails-container')
const thumbnails = [...thumbnailsContainer.querySelectorAll('.gallery--thumbnails')]

thumbnails.forEach(thumbnail => thumbnail.addEventListener('click', handleClickThumbnails))

function handleClickThumbnails(event) {
  const thumbnail = event.target.closest('button')
  if (!thumbnail) return

  document.querySelector('.lightbox--open').firstElementChild.setAttribute('src', thumbnail.dataset.src)

  const currentSlideIndex = lightBox.currentSlideIndex
  const targetSlideIndex = thumbnails.findIndex(th => th === thumbnail)
  lightBox.switchSlide(currentSlideIndex, targetSlideIndex)

  const currentThumbnail = thumbnails.find(th => th.hasAttribute('data-selected'))
  const targetThumbnail = thumbnails[targetSlideIndex]
  currentThumbnail.classList.remove('border-orange')
  currentThumbnail.firstElementChild.classList.remove('opacity-50')
  currentThumbnail.removeAttribute('data-selected')
  targetThumbnail.classList.add('border-orange')
  targetThumbnail.firstElementChild.classList.add('opacity-50')
  targetThumbnail.setAttribute('data-selected', '')
}
