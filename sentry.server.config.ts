import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring for server
  tracesSampleRate: 0.1,
  
  beforeSend(event) {
    // Filter out development errors
    if (event.environment === 'development') return null;
    
    // Don't send info/warning level events
    if (event.level === 'info' || event.level === 'warning') return null;
    
    return event;
  },
  
  beforeSendTransaction(event) {
    // Don't send transactions in development
    if (event.environment === 'development') return null;
    return event;
  },
});