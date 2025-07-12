import { NewsletterFormClient } from './newsletter-form-client'
import { getTranslations } from 'next-intl/server'

export async function NewsletterSection() {
  const t = await getTranslations('newsletter')
  return (
    <section className="min-h-[300px] md:h-96 flex relative">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0 border-t border-l border-black">
        <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
          <h3 className="text-lg sm:text-3xl md:text-4xl font-bold">БЪДИ МИНИМАЛИСТИЧЕН</h3>
          <p className="text-black/70 text-xs sm:text-base md:text-lg">{t('minimalDesc')}</p>
          <NewsletterFormClient 
            variant="light"
            buttonText={t('subscribe')}
            placeholder={t('enterEmail')}
          />
        </div>
      </div>

      <div className="w-1/2 bg-black flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0">
        <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
          <h3 className="text-lg sm:text-3xl md:text-4xl font-bold text-white">БЪДИ СМЕЛ И НЕРЕШИТЕЛЕН</h3>
          <p className="text-white/70 text-xs sm:text-base md:text-lg">Бъди уверен, изрази себе си</p>
          <NewsletterFormClient 
            variant="dark"
            buttonText={t('subscribe')}
            placeholder={t('enterEmail')}
          />
        </div>
      </div>
    </section>
  )
}