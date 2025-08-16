/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_AI_BASE_URL: string
  readonly VITE_ZOOM_CLIENT_ID: string
  readonly VITE_COINROUTES_API_KEY: string
  readonly VITE_SQUAWK_KEY: string
  readonly VITE_SQUAWK_VALUE: string
  readonly VITE_TWITTER_CLIENT_ID: string
  readonly VITE_AES_SECRET_KEY: string
  readonly VITE_CDN: string
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_LINKEDIN_CLIENT_ID: string
  readonly VITE_BOOK_CALL_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// SVG module declarations
declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'

  const ReactComponent: FC<SVGProps<SVGSVGElement>>
  export default ReactComponent
}

// For backward compatibility with process.env
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_Base_Url: string
    REACT_APP_AI_BASE_URL: string
    REACT_APP_ZOOM_CLIENT_ID: string
    REACT_APP_COINROUTES_API_KEY: string
    REACT_APP_Squawk_Key: string
    REACT_APP_Squawk_Value: string
    REACT_APP_TWITTER_CLIENT_ID: string
    REACT_APP_AES_SECRET_KEY: string
    REACT_APP_CDN: string
    REACT_APP_PUBLIC_PATH: string
    REACT_APP_GOOGLE_CLIENT_ID: string
    REACT_APP_LINKEDIN_CLIENT_ID: string
    REACT_APP_BOOK_CALL_SECRET: string
  }
}
