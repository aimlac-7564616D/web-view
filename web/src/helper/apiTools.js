const s = 1000

const apiCall = async (url, options={}) => {
  const { timeout = 60*s } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  })

  clearTimeout(id)

  return response
}

export { apiCall }