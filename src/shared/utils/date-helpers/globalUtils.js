import { ENV } from '../../../utils/env'

const getImageCdnUrl = (path) => `${ENV.CDN}/application/static-assets/${path}`

const getImageWebsiteCdnUrl = (path) => `${ENV.CDN}/website/images/${path}`

const getLogoCdn = (path) => `${ENV.CDN}/website/logos/${path}`

export { getLogoCdn, getImageCdnUrl, getImageWebsiteCdnUrl }
