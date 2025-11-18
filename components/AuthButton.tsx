'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => router.push('/login')}
      className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
    >
      Login
    </button>
  )
}

