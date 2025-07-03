import { getTranslations } from 'next-intl/server';
import { getHeroSlides } from '@/lib/shopify/hero-products';
import { HeroClient } from './hero-client';

export async function Hero() {
  const t = await getTranslations('hero');
  const tb = await getTranslations('brand');
  
  // Fetch hero slides on the server
  let slides;
  try {
    slides = await getHeroSlides(5);
  } catch (_error) {
    // Fallback slides if API fails
    slides = [
      {
        id: 'fallback-1',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1600&fit=crop',
        name: 'Premium Collection',
      },
      {
        id: 'fallback-2', 
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=1600&fit=crop',
        name: 'Urban Style',
      },
    ];
  }
  
  // Pre-translate all strings on the server
  const translations = {
    customers: t('customers'),
    trending: t('trending'),
    from: t('from'),
    freeShipping: t('freeShipping'),
    shopNow: t('shopNow'),
    viewCollection: t('viewCollection'),
    shopCollection: t('shopCollection'),
    limitedStock: t('limitedStock'),
    marquee: {
      freeShipping: t('marquee.freeShipping'),
      returns: t('marquee.returns'),
      joinCustomers: t('marquee.joinCustomers', { count: '4876' }),
      newArrivals: t('marquee.newArrivals'),
    },
    brand: {
      name: tb('name'),
      socialHandle: tb('social.handle'),
    }
  };
  
  return (
    <HeroClient 
      slides={slides} 
      translations={translations}
    />
  );
}