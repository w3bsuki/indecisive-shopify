'use client'

import { useState, useEffect } from 'react'
import type { InstagramPost } from '@/lib/instagram/client'

interface UseInstagramOptions {
  limit?: number
  enabled?: boolean
}

interface UseInstagramResult {
  posts: InstagramPost[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useInstagram({ 
  limit = 6, 
  enabled = true 
}: UseInstagramOptions = {}): UseInstagramResult {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/instagram/posts?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setPosts(data.posts || [])
    } catch (err) {
      console.error('Failed to fetch Instagram posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      setPosts([]) // Clear posts on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [limit, enabled])

  const refetch = () => {
    fetchPosts()
  }

  return {
    posts,
    loading,
    error,
    refetch
  }
}