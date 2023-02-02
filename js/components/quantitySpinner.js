export default function QuantitySpinner(container) {
  const containerElement = container
  const inputElement = container.querySelector('.qty--input')
  const incrementBtn = container.querySelector('.qty--increment')
  const decrementBtn = container.querySelector('.qty--decrement')

  let qty = parseInt(inputElement.dataset.min)
  const minQty = parseInt(inputElement.dataset.min)
  const maxQty = parseInt(inputElement.dataset.max)

  containerElement.addEventListener('click', handleClick)

  toggleBtnsDisable()

  function handleClick(event) {
    if (event.target.closest('.qty--decrement')) decreaseQuantity()
    if (event.target.closest('.qty--increment')) increaseQuantity()

    changeInput()
    toggleBtnsDisable()
  }

  function changeInput() {
    inputElement.textContent = qty
    inputElement.dataset.qty = qty
    inputElement.setAttribute('aria-valuenow', qty)
  }

  function toggleBtnsDisable() {
    if (qty === minQty) decrementBtn.setAttribute('disabled', 'true')
    if (qty > minQty) decrementBtn.removeAttribute('disabled')
    if (qty === maxQty) incrementBtn.setAttribute('disabled', 'true')
    if (qty < maxQty) incrementBtn.removeAttribute('disabled')
  }

  function increaseQuantity() {
    if (qty >= maxQty) return
    qty++
  }

  function decreaseQuantity() {
    if (qty === minQty) return
    qty--
  }

  return {
    get quantity() {
      return qty
    }
  }
}
