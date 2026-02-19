// Login request DTO
export type LoginRequestDTO = {
  username: string
  password: string
}
const BASE = 'https://timelinebackend-2f2f.onrender.com'

// Login API: returns JWT string
export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/api/timeline/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) throw new Error('Login failed: ' + res.status)
  return res.text()
}
export type TopItemDTO = {
  name?: string
  playCount?: number
}

export type TimelineResponseDTO = {
  year: number
  totalMinutes?: number
  totalPlays?: number
  topSongs?: TopItemDTO[]
  topArtists?: TopItemDTO[]
  topAlbums?: TopItemDTO[]
}



export async function getTimeline(userId: string, year: number, token?: string): Promise<TimelineResponseDTO> {
  const url = `${BASE}/api/timeline/${encodeURIComponent(userId)}/${year}`
  const headers: Record<string,string> = { 'Accept': 'application/json' }
  if (token) headers['Authorization'] = token.startsWith('Bearer') ? token : `Bearer ${token}`

  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  return res.json()
}
