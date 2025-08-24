import { getTranslations } from 'next-intl/server'
import { CustomProductConfigurator } from '@/components/custom/custom-product-configurator'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Custom Products | Indecisive Wear',
  description: 'Design your own custom t-shirts, hats, and bags with personalized text and graphics.',
}

export default async function CustomPage() {
  const t = await getTranslations('custom')
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-0 md:pt-4 pb-20 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Compact and Modern */}
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl font-black font-mono uppercase tracking-tight text-black mb-1">
              {t('title', { fallback: 'Design Your Own' })}
            </h1>
            <p className="text-gray-600 text-xs md:text-sm max-w-md mx-auto">
              {t('subtitle', { fallback: 'Create custom t-shirts, hats, and bags with your own text and designs' })}
            </p>
          </div>
          
          {/* Configurator */}
          <CustomProductConfigurator />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}