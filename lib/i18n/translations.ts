export interface Translations {
  // Navigation
  'nav.products': string
  'nav.collections': string
  'nav.about': string
  'nav.contact': string
  'nav.cart': string
  'nav.account': string
  'nav.login': string
  'nav.logout': string
  
  // Homepage
  'home.hero.title': string
  'home.hero.subtitle': string
  'home.hero.cta': string
  'home.featured.title': string
  'home.community.title': string
  'home.community.subtitle': string
  'home.coming-soon.title': string
  
  // Products
  'products.title': string
  'products.add-to-cart': string
  'products.quick-view': string
  'products.view-all': string
  'products.price-from': string
  'products.sold-out': string
  'products.available': string
  
  // Cart
  'cart.title': string
  'cart.empty.title': string
  'cart.empty.subtitle': string
  'cart.empty.cta': string
  'cart.subtotal': string
  'cart.shipping': string
  'cart.tax': string
  'cart.total': string
  'cart.checkout': string
  'cart.continue-shopping': string
  'cart.remove': string
  'cart.clear': string
  'cart.discount-code': string
  'cart.apply': string
  'cart.calculated-at-checkout': string
  
  // Authentication
  'auth.login.title': string
  'auth.login.subtitle': string
  'auth.login.email': string
  'auth.login.password': string
  'auth.login.submit': string
  'auth.login.forgot-password': string
  'auth.login.no-account': string
  'auth.login.create-account': string
  'auth.register.title': string
  'auth.register.subtitle': string
  'auth.register.first-name': string
  'auth.register.last-name': string
  'auth.register.email': string
  'auth.register.password': string
  'auth.register.confirm-password': string
  'auth.register.submit': string
  'auth.register.have-account': string
  'auth.register.sign-in': string
  'auth.register.terms': string
  
  // Account
  'account.title': string
  'account.welcome': string
  'account.details': string
  'account.orders': string
  'account.addresses': string
  'account.edit-profile': string
  'account.no-orders': string
  'account.no-addresses': string
  'account.add-address': string
  'account.logout': string
  
  // Common
  'common.loading': string
  'common.error': string
  'common.success': string
  'common.back': string
  'common.next': string
  'common.previous': string
  'common.search': string
  'common.filter': string
  'common.sort': string
  'common.view-more': string
  'common.coming-soon': string
  'common.sold-out': string
  'common.new': string
  'common.sale': string
  
  // Footer
  'footer.customer-service': string
  'footer.about-us': string
  'footer.contact': string
  'footer.shipping': string
  'footer.returns': string
  'footer.size-guide': string
  'footer.privacy': string
  'footer.terms': string
  'footer.newsletter.title': string
  'footer.newsletter.subtitle': string
  'footer.newsletter.placeholder': string
  'footer.newsletter.submit': string
  'footer.social.follow': string
  'footer.copyright': string
  
  // Messages
  'messages.added-to-cart': string
  'messages.removed-from-cart': string
  'messages.cart-updated': string
  'messages.login-success': string
  'messages.login-failed': string
  'messages.register-success': string
  'messages.register-failed': string
  'messages.logout-success': string
}

export const translations: Record<string, Translations> = {
  bg: {
    // Navigation
    'nav.products': 'ПРОДУКТИ',
    'nav.collections': 'КОЛЕКЦИИ',
    'nav.about': 'ЗА НАС',
    'nav.contact': 'КОНТАКТ',
    'nav.cart': 'КОШНИЦА',
    'nav.account': 'ПРОФИЛ',
    'nav.login': 'ВХОД',
    'nav.logout': 'ИЗХОД',
    
    // Homepage
    'home.hero.title': 'МОДА ЗА НЕРЕШИТЕЛНИТЕ',
    'home.hero.subtitle': 'Когато не можеш да решиш, избери всичко',
    'home.hero.cta': 'РАЗГЛЕДАЙ КОЛЕКЦИЯТА',
    'home.featured.title': 'ИЗБРАНИ ПРОДУКТИ',
    'home.community.title': 'ОБЩНОСТЕН СТИЛ',
    'home.community.subtitle': 'Сподели своя стил #IndecisiveWear',
    'home.coming-soon.title': 'СКОРО',
    
    // Products
    'products.title': 'ВСИЧКИ ПРОДУКТИ',
    'products.add-to-cart': 'ДОБАВИ В КОШНИЦАТА',
    'products.quick-view': 'БЪРЗ ПРЕГЛЕД',
    'products.view-all': 'ВСИЧКИ ПРОДУКТИ',
    'products.price-from': 'ОТ',
    'products.sold-out': 'ИЗЧЕРПАНО',
    'products.available': 'В НАЛИЧНОСТ',
    
    // Cart
    'cart.title': 'КОШНИЦА',
    'cart.empty.title': 'КОШНИЦАТА Е ПРАЗНА',
    'cart.empty.subtitle': 'Изглежда още не сте добавили нищо.',
    'cart.empty.cta': 'ПРОДЪЛЖИ ПАЗАРУВАНЕТО',
    'cart.subtotal': 'Междинна сума',
    'cart.shipping': 'Доставка',
    'cart.tax': 'Данък',
    'cart.total': 'Общо',
    'cart.checkout': 'КЪМ ПЛАЩАНЕ',
    'cart.continue-shopping': 'ПРОДЪЛЖИ ПАЗАРУВАНЕТО',
    'cart.remove': 'Премахни',
    'cart.clear': 'ИЗЧИСТИ КОШНИЦАТА',
    'cart.discount-code': 'Код за отстъпка',
    'cart.apply': 'ПРИЛОЖИ',
    'cart.calculated-at-checkout': 'Изчислява се при плащане',
    
    // Authentication
    'auth.login.title': 'ВХОД',
    'auth.login.subtitle': 'Добре дошли обратно в Indecisive Wear',
    'auth.login.email': 'Имейл',
    'auth.login.password': 'Парола',
    'auth.login.submit': 'ВЛЕЗ',
    'auth.login.forgot-password': 'Забравена парола?',
    'auth.login.no-account': 'Нямате профил?',
    'auth.login.create-account': 'Създайте тук',
    'auth.register.title': 'СЪЗДАЙ ПРОФИЛ',
    'auth.register.subtitle': 'Присъединете се към общността Indecisive Wear',
    'auth.register.first-name': 'Име',
    'auth.register.last-name': 'Фамилия',
    'auth.register.email': 'Имейл',
    'auth.register.password': 'Парола',
    'auth.register.confirm-password': 'Потвърди паролата',
    'auth.register.submit': 'СЪЗДАЙ ПРОФИЛ',
    'auth.register.have-account': 'Вече имате профил?',
    'auth.register.sign-in': 'Влезте тук',
    'auth.register.terms': 'Създавайки профил, се съгласявате с нашите Условия за ползване и Политика за поверителност.',
    
    // Account
    'account.title': 'МОЯ ПРОФИЛ',
    'account.welcome': 'Добре дошли обратно',
    'account.details': 'Детайли на профила',
    'account.orders': 'Поръчки',
    'account.addresses': 'Адреси',
    'account.edit-profile': 'Редактирай профила',
    'account.no-orders': 'Все още няма поръчки',
    'account.no-addresses': 'Няма запазени адреси',
    'account.add-address': 'Добави адрес',
    'account.logout': 'Изход',
    
    // Common
    'common.loading': 'Зарежда...',
    'common.error': 'Грешка',
    'common.success': 'Успех',
    'common.back': 'Назад',
    'common.next': 'Напред',
    'common.previous': 'Предишен',
    'common.search': 'Търсене',
    'common.filter': 'Филтър',
    'common.sort': 'Сортиране',
    'common.view-more': 'Виж повече',
    'common.coming-soon': 'СКОРО',
    'common.sold-out': 'ИЗЧЕРПАНО',
    'common.new': 'НОВО',
    'common.sale': 'НАМАЛЕНИЕ',
    
    // Footer
    'footer.customer-service': 'Клиентско обслужване',
    'footer.about-us': 'За нас',
    'footer.contact': 'Контакт',
    'footer.shipping': 'Доставка',
    'footer.returns': 'Връщания',
    'footer.size-guide': 'Размери',
    'footer.privacy': 'Поверителност',
    'footer.terms': 'Условия',
    'footer.newsletter.title': 'БЮЛЕТИН',
    'footer.newsletter.subtitle': 'Получавайте най-новите новини',
    'footer.newsletter.placeholder': 'Вашият имейл',
    'footer.newsletter.submit': 'АБОНИРАЙ СЕ',
    'footer.social.follow': 'Следете ни',
    'footer.copyright': '© 2025 Indecisive Wear. Всички права запазени.',
    
    // Messages
    'messages.added-to-cart': 'Добавено в кошницата',
    'messages.removed-from-cart': 'Премахнато от кошницата',
    'messages.cart-updated': 'Кошницата е обновена',
    'messages.login-success': 'Успешен вход',
    'messages.login-failed': 'Неуспешен вход',
    'messages.register-success': 'Профилът е създаден успешно',
    'messages.register-failed': 'Неуспешно създаване на профил',
    'messages.logout-success': 'Успешен изход',
  },
  
  en: {
    // Navigation
    'nav.products': 'PRODUCTS',
    'nav.collections': 'COLLECTIONS',
    'nav.about': 'ABOUT',
    'nav.contact': 'CONTACT',
    'nav.cart': 'CART',
    'nav.account': 'ACCOUNT',
    'nav.login': 'LOGIN',
    'nav.logout': 'LOGOUT',
    
    // Homepage
    'home.hero.title': 'FASHION FOR THE INDECISIVE',
    'home.hero.subtitle': 'When you can\'t decide, choose everything',
    'home.hero.cta': 'EXPLORE COLLECTION',
    'home.featured.title': 'FEATURED PRODUCTS',
    'home.community.title': 'COMMUNITY STYLE',
    'home.community.subtitle': 'Share your style #IndecisiveWear',
    'home.coming-soon.title': 'COMING SOON',
    
    // Products
    'products.title': 'ALL PRODUCTS',
    'products.add-to-cart': 'ADD TO CART',
    'products.quick-view': 'QUICK VIEW',
    'products.view-all': 'VIEW ALL PRODUCTS',
    'products.price-from': 'FROM',
    'products.sold-out': 'SOLD OUT',
    'products.available': 'AVAILABLE',
    
    // Cart
    'cart.title': 'SHOPPING CART',
    'cart.empty.title': 'YOUR CART IS EMPTY',
    'cart.empty.subtitle': 'Looks like you haven\'t added anything yet.',
    'cart.empty.cta': 'CONTINUE SHOPPING',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.total': 'Total',
    'cart.checkout': 'PROCEED TO CHECKOUT',
    'cart.continue-shopping': 'CONTINUE SHOPPING',
    'cart.remove': 'Remove',
    'cart.clear': 'CLEAR CART',
    'cart.discount-code': 'Discount code',
    'cart.apply': 'APPLY',
    'cart.calculated-at-checkout': 'Calculated at checkout',
    
    // Authentication
    'auth.login.title': 'SIGN IN',
    'auth.login.subtitle': 'Welcome back to Indecisive Wear',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.submit': 'SIGN IN',
    'auth.login.forgot-password': 'Forgot password?',
    'auth.login.no-account': 'Don\'t have an account?',
    'auth.login.create-account': 'Create one here',
    'auth.register.title': 'CREATE ACCOUNT',
    'auth.register.subtitle': 'Join the Indecisive Wear community',
    'auth.register.first-name': 'First Name',
    'auth.register.last-name': 'Last Name',
    'auth.register.email': 'Email',
    'auth.register.password': 'Password',
    'auth.register.confirm-password': 'Confirm Password',
    'auth.register.submit': 'CREATE ACCOUNT',
    'auth.register.have-account': 'Already have an account?',
    'auth.register.sign-in': 'Sign in here',
    'auth.register.terms': 'By creating an account, you agree to our Terms of Service and Privacy Policy.',
    
    // Account
    'account.title': 'MY ACCOUNT',
    'account.welcome': 'Welcome back',
    'account.details': 'Account Details',
    'account.orders': 'Recent Orders',
    'account.addresses': 'Address Book',
    'account.edit-profile': 'Edit Profile',
    'account.no-orders': 'No orders yet',
    'account.no-addresses': 'No addresses saved',
    'account.add-address': 'Add Address',
    'account.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.view-more': 'View More',
    'common.coming-soon': 'COMING SOON',
    'common.sold-out': 'SOLD OUT',
    'common.new': 'NEW',
    'common.sale': 'SALE',
    
    // Footer
    'footer.customer-service': 'Customer Service',
    'footer.about-us': 'About Us',
    'footer.contact': 'Contact',
    'footer.shipping': 'Shipping',
    'footer.returns': 'Returns',
    'footer.size-guide': 'Size Guide',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.newsletter.title': 'NEWSLETTER',
    'footer.newsletter.subtitle': 'Get the latest updates',
    'footer.newsletter.placeholder': 'Your email',
    'footer.newsletter.submit': 'SUBSCRIBE',
    'footer.social.follow': 'Follow Us',
    'footer.copyright': '© 2025 Indecisive Wear. All rights reserved.',
    
    // Messages
    'messages.added-to-cart': 'Added to cart',
    'messages.removed-from-cart': 'Removed from cart',
    'messages.cart-updated': 'Cart updated',
    'messages.login-success': 'Login successful',
    'messages.login-failed': 'Login failed',
    'messages.register-success': 'Account created successfully',
    'messages.register-failed': 'Registration failed',
    'messages.logout-success': 'Logged out successfully',
  },
  
  de: {
    // Navigation
    'nav.products': 'PRODUKTE',
    'nav.collections': 'KOLLEKTIONEN',
    'nav.about': 'ÜBER UNS',
    'nav.contact': 'KONTAKT',
    'nav.cart': 'WARENKORB',
    'nav.account': 'KONTO',
    'nav.login': 'ANMELDEN',
    'nav.logout': 'ABMELDEN',
    
    // Homepage
    'home.hero.title': 'MODE FÜR UNENTSCHLOSSENE',
    'home.hero.subtitle': 'Wenn du dich nicht entscheiden kannst, wähle alles',
    'home.hero.cta': 'KOLLEKTION ENTDECKEN',
    'home.featured.title': 'FEATURED PRODUKTE',
    'home.community.title': 'COMMUNITY STYLE',
    'home.community.subtitle': 'Teile deinen Style #IndecisiveWear',
    'home.coming-soon.title': 'KOMMT BALD',
    
    // Products
    'products.title': 'ALLE PRODUKTE',
    'products.add-to-cart': 'IN DEN WARENKORB',
    'products.quick-view': 'SCHNELLANSICHT',
    'products.view-all': 'ALLE PRODUKTE ANZEIGEN',
    'products.price-from': 'AB',
    'products.sold-out': 'AUSVERKAUFT',
    'products.available': 'VERFÜGBAR',
    
    // Cart
    'cart.title': 'WARENKORB',
    'cart.empty.title': 'IHR WARENKORB IST LEER',
    'cart.empty.subtitle': 'Sie haben noch nichts hinzugefügt.',
    'cart.empty.cta': 'WEITER EINKAUFEN',
    'cart.subtotal': 'Zwischensumme',
    'cart.shipping': 'Versand',
    'cart.tax': 'Steuer',
    'cart.total': 'Gesamt',
    'cart.checkout': 'ZUR KASSE',
    'cart.continue-shopping': 'WEITER EINKAUFEN',
    'cart.remove': 'Entfernen',
    'cart.clear': 'WARENKORB LEEREN',
    'cart.discount-code': 'Rabattcode',
    'cart.apply': 'ANWENDEN',
    'cart.calculated-at-checkout': 'Wird an der Kasse berechnet',
    
    // Authentication
    'auth.login.title': 'ANMELDEN',
    'auth.login.subtitle': 'Willkommen zurück bei Indecisive Wear',
    'auth.login.email': 'E-Mail',
    'auth.login.password': 'Passwort',
    'auth.login.submit': 'ANMELDEN',
    'auth.login.forgot-password': 'Passwort vergessen?',
    'auth.login.no-account': 'Noch kein Konto?',
    'auth.login.create-account': 'Hier erstellen',
    'auth.register.title': 'KONTO ERSTELLEN',
    'auth.register.subtitle': 'Werden Sie Teil der Indecisive Wear Community',
    'auth.register.first-name': 'Vorname',
    'auth.register.last-name': 'Nachname',
    'auth.register.email': 'E-Mail',
    'auth.register.password': 'Passwort',
    'auth.register.confirm-password': 'Passwort bestätigen',
    'auth.register.submit': 'KONTO ERSTELLEN',
    'auth.register.have-account': 'Bereits ein Konto?',
    'auth.register.sign-in': 'Hier anmelden',
    'auth.register.terms': 'Mit der Erstellung eines Kontos stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.',
    
    // Account
    'account.title': 'MEIN KONTO',
    'account.welcome': 'Willkommen zurück',
    'account.details': 'Kontodetails',
    'account.orders': 'Letzte Bestellungen',
    'account.addresses': 'Adressbuch',
    'account.edit-profile': 'Profil bearbeiten',
    'account.no-orders': 'Noch keine Bestellungen',
    'account.no-addresses': 'Keine Adressen gespeichert',
    'account.add-address': 'Adresse hinzufügen',
    'account.logout': 'Abmelden',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Vorherige',
    'common.search': 'Suchen',
    'common.filter': 'Filter',
    'common.sort': 'Sortieren',
    'common.view-more': 'Mehr anzeigen',
    'common.coming-soon': 'KOMMT BALD',
    'common.sold-out': 'AUSVERKAUFT',
    'common.new': 'NEU',
    'common.sale': 'SALE',
    
    // Footer
    'footer.customer-service': 'Kundenservice',
    'footer.about-us': 'Über uns',
    'footer.contact': 'Kontakt',
    'footer.shipping': 'Versand',
    'footer.returns': 'Rücksendungen',
    'footer.size-guide': 'Größentabelle',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'AGB',
    'footer.newsletter.title': 'NEWSLETTER',
    'footer.newsletter.subtitle': 'Erhalten Sie die neuesten Updates',
    'footer.newsletter.placeholder': 'Ihre E-Mail',
    'footer.newsletter.submit': 'ABONNIEREN',
    'footer.social.follow': 'Folgen Sie uns',
    'footer.copyright': '© 2025 Indecisive Wear. Alle Rechte vorbehalten.',
    
    // Messages
    'messages.added-to-cart': 'Zum Warenkorb hinzugefügt',
    'messages.removed-from-cart': 'Aus Warenkorb entfernt',
    'messages.cart-updated': 'Warenkorb aktualisiert',
    'messages.login-success': 'Anmeldung erfolgreich',
    'messages.login-failed': 'Anmeldung fehlgeschlagen',
    'messages.register-success': 'Konto erfolgreich erstellt',
    'messages.register-failed': 'Registrierung fehlgeschlagen',
    'messages.logout-success': 'Erfolgreich abgemeldet',
  }
}