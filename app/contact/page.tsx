import { getTranslations } from 'next-intl/server'

export default async function ContactPage() {
  const t = await getTranslations('footer')
  const tl = await getTranslations('legal')
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-mono font-bold mb-4">{t('contact')}</h1>
      <p className="text-gray-600">{tl('contactIntro')}</p>
    </main>
  )
}
