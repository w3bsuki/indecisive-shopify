import { HeroEnhancedServer } from './hero-enhanced-server'

// Server-side hero wrapper - defaults to enhanced version
// A/B testing would need to be done at edge/middleware level for server components
export async function HeroWrapperServer() {
  // For now, always use the enhanced version
  // In production, you could read from cookies or headers to determine variant
  return <HeroEnhancedServer />
}