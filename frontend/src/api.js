const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = body.detail
      ? typeof body.detail === 'string'
        ? body.detail
        : JSON.stringify(body.detail)
      : `Request failed (${response.status})`
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function getExpenses(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  return request(`/expenses${query}`)
}

export function createExpense(data) {
  return request('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteExpense(id) {
  return request(`/expenses/${id}`, { method: 'DELETE' })
}

export function getSummary() {
  return request('/summary')
}
