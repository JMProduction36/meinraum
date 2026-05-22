import { useState, useEffect } from 'react'
import { getPortfolioData } from '../lib/github'

export function useGitHubData(file, fallback = null) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getPortfolioData(file)
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => {
        if (!cancelled) {
          console.warn(`GitHub fetch failed for ${file}, using fallback`, e)
          setData(fallback)
          setError(e.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [file])

  return { data, loading, error }
}
