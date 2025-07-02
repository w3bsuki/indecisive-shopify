interface Window {
  gtag?: (
    command: string,
    ...args: any[]
  ) => void
  fbq?: (
    command: string,
    ...args: any[]
  ) => void
}