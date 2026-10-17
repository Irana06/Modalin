import { useEffect, useState } from 'react'
import api from './api'

/** GET a resource, refetching when the params change. Keeps the previous data while reloading. */
export function useApi(url, params = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)
  const key = JSON.stringify(params)

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))
    api.get(url, { params: JSON.parse(key) }).then(
      (res) => active && setState({ data: res.data, loading: false, error: null }),
      (error) => active && setState((s) => ({ ...s, loading: false, error })),
    )
    return () => { active = false }
  }, [url, key, reloadKey])

  return { ...state, reload: () => setReloadKey((k) => k + 1) }
}
