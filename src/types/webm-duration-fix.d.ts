declare module 'webm-duration-fix' {
  interface FixOptions {
    logger?: boolean | ((message: string) => void)
  }

  function fixWebmDuration(
    blob: Blob,
    duration: number,
    options?: FixOptions,
  ): Promise<Blob>

  export default fixWebmDuration
}
