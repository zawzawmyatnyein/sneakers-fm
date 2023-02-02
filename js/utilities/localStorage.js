export function get(key) {
  const value = localStorage.getItem(key)
  if (!value) return

  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

export function set(key, value) {
  if (typeof value === 'string') {
    localStorage.setItem(key, value)
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export function remove(key) {
  localStorage.removeItem(key)
}
