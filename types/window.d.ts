interface Window {
  dataLayer?: unknown[]
  gtag?: (
    command: string,
    ...args: any[]
  ) => void
  fbq?: (
    command: string,
    ...args: any[]
  ) => void
  Sentry?: {
    captureException: (error: Error) => void
    captureMessage: (message: string) => void
    addBreadcrumb: (breadcrumb: any) => void
  }
}