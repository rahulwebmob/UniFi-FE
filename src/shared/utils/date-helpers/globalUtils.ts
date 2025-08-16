import { ENV } from '../../../utils/env'

const getImageCdnUrl = (path: string): string =>
  `${ENV.CDN}/application/static-assets/${path}`

const getImageWebsiteCdnUrl = (path: string): string =>
  `${ENV.CDN}/website/images/${path}`

const getLogoCdn = (path: string): string => `${ENV.CDN}/website/logos/${path}`

export { getLogoCdn, getImageCdnUrl, getImageWebsiteCdnUrl }
