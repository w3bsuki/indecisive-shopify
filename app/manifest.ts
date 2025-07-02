import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Indecisive Wear - Streetwear Fashion Store',
    short_name: 'Indecisive Wear',
    description: 'Premium streetwear fashion store with the latest trends and styles. Shop hoodies, t-shirts, and accessories.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    categories: ['shopping', 'lifestyle', 'fashion'],
    lang: 'en',
    dir: 'ltr'
  }
}