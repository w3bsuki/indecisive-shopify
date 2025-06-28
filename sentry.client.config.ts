import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,
  
  // Capture 100% of the transactions for session replay
  replaysSessionSampleRate: 0.1,
  
  // Capture 100% of errors for session replay
  replaysOnErrorSampleRate: 1.0,
  
  beforeSend(event) {
    // Filter out development errors and noise
    if (event.environment === 'development') return null;
    
    // Filter out non-critical errors
    if (event.level === 'info' || event.level === 'warning') return null;
    
    return event;
  },
  
  beforeSendTransaction(event) {
    // Don't send transactions in development
    if (event.environment === 'development') return null;
    return event;
  },
  
  integrations: [
    Sentry.replayIntegration({
      // Mask sensitive data
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});