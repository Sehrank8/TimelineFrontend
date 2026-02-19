

import React, { useState, useEffect } from 'react'
import { getTimeline, TimelineResponseDTO } from './api'
import { Music, BarChart3, Disc3, Search, Loader2 } from 'lucide-react'
import LoginPage from './LoginPage'
import { decodeJwtPayload } from './jwt'



export default function App() {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [year, setYear] = useState<number | ''>('')
  const [data, setData] = useState<TimelineResponseDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // When token changes, decode userId from JWT
  useEffect(() => {
    if (token) {
      const payload = decodeJwtPayload(token)
      // Try common userId fields: sub, userId, id, username
      setUserId(payload?.userId || payload?.sub || payload?.id || payload?.username || '')
    } else {
      setUserId('')
    }
  }, [token])

  async function fetchTimeline() {
    setLoading(true)
    setError(null)
    try {
      if (!userId || !year) throw new Error('Please enter year')
      const res = await getTimeline(userId, Number(year), token || undefined)
      setData(res)
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  // Show login page if not authenticated
  if (!token) {
    return <LoginPage onLogin={setToken} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Music className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold">Timeline</h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Box */}
        <div className="mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-400" />
              Your Timeline
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="bg-gray-800 border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                placeholder="Year"
                type="number"
                value={year}
                onChange={e => setYear(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <button
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white font-bold py-3 rounded-full transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={fetchTimeline}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BarChart3 className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate Timeline'}
            </button>
          </div>
          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 flex gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {data && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={<Music className="w-6 h-6" />}
                label="Total Minutes"
                value={data.totalMinutes?.toLocaleString() ?? '—'}
              />
              <StatCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Total Plays"
                value={data.totalPlays?.toLocaleString() ?? '—'}
              />
              <StatCard
                icon={<Disc3 className="w-6 h-6" />}
                label="Year"
                value={data.year?.toString() ?? '—'}
              />
            </div>

            {/* Top Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RankCard title="🎵 Top Songs" items={data.topSongs} />
              <RankCard title="🎤 Top Artists" items={data.topArtists} />
              <RankCard title="💿 Top Albums" items={data.topAlbums} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && (
          <div className="mt-12 text-center text-gray-400">
            <Disc3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Enter your details above to see your timeline</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 text-center hover:border-purple-600 transition">
      <div className="text-purple-400 mb-2 flex justify-center">{icon}</div>
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  )
}

function RankCard({ title, items }: { title: string; items?: { name?: string; playCount?: number }[] }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:border-purple-600 transition">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <ol className="space-y-3">
        {(!items || items.length === 0) && <li className="text-gray-500 text-sm">No items</li>}
        {items?.slice(0, 5).map((it, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm hover:text-purple-300 transition group">
            <span className="text-purple-400 font-bold text-lg">{String(idx + 1).padStart(2, '0')}</span>
            <div className="flex-1">
              <div className="font-medium truncate group-hover:text-purple-300">{it.name ?? '—'}</div>
              <div className="text-gray-500 text-xs">{it.playCount?.toLocaleString() ?? 0} plays</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
