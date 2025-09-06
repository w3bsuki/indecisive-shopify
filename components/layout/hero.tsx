import { getTranslations } from 'next-intl/server';
import { HeroClient } from './hero-client';

export async function Hero() {
  const t = await getTranslations('hero');
  const tb = await getTranslations('brand');
  
  // Hardcoded collection slides with new model images
  const slides = [
    {
      id: 'hats-collection',
      image: '/indecisive-stars/star18.webp',
      name: 'HATS',
      collectionHandle: 'hats',
      ctaLink: '/hats'
    },
    {
      id: 'bags-collection',
      image: '/indecisive-stars/star11.webp',
      name: 'BAGS',
      collectionHandle: 'bags',
      ctaLink: '/accessories'
    },
    {
      id: 'croptops-collection',
      image: '/indecisive-stars/star22.webp',
      name: 'CROP TOPS',
      collectionHandle: 'crop-tops',
      ctaLink: '/crop-tops'
    }
  ];
  
  // Pre-translate all strings on the server
  const translations = {
    customers: t('customers'),
    trending: t('trending'),
    from: t('from'),
    freeShipping: t('freeShipping'),
    shopNow: t('shopNow'),
    viewCollection: t('viewCollection'),
    shopCollection: t('shopCollection'),
    exploreHats: t('exploreHats'),
    exploreBags: t('exploreBags'),
    exploreCropTops: t('exploreCropTops'),
    hatsSubtitle: t('hatsSubtitle'),
    bagsSubtitle: t('bagsSubtitle'),
    cropTopsSubtitle: t('cropTopsSubtitle'),
    limitedStock: t('limitedStock'),
    marquee: {
      freeShipping: t('marquee.freeShipping'),
      returns: t('marquee.returns'),
      joinCustomers: t('marquee.joinCustomers', { count: '4876' }),
      newArrivals: t('marquee.newArrivals'),
      followInstagram: t('marquee.followInstagram'),
      beMinimalBold: t('marquee.beMinimalBold'),
      stayIndecisive: t('marquee.stayIndecisive'),
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