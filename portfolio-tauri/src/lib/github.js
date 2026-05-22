// Configuration — change GITHUB_USER and GITHUB_REPO to your values
export const GITHUB_USER = 'JMProduction36'
export const GITHUB_REPO = 'portfolio-data' // Le nom du dépôt où tu mettras tes 3 fichiers JSON
const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main`

async function fetchJSON(file) {
  const res = await fetch(`${BASE_URL}/${file}`)
  if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.status}`)
  return res.json()
}

// Simple cache to avoid re-fetching on every window open
const cache = {}

export async function getPortfolioData(file) {
  if (cache[file]) return cache[file]
  const data = await fetchJSON(file)
  cache[file] = data
  return data
}

export function clearCache() {
  Object.keys(cache).forEach(k => delete cache[k])
}
