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
      
      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-handwritten text-black mb-4 transform -rotate-1">
              {t('title', { fallback: 'Design Your Own' })}
            </h1>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
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