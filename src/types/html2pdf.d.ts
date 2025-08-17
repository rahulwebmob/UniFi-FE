declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number]
    filename?: string
    image?: {
      type?: 'jpeg' | 'png' | 'webp'
      quality?: number
    }
    html2canvas?: {
      scale?: number
      logging?: boolean
      letterRendering?: boolean
      useCORS?: boolean
      [key: string]: unknown
    }
    jsPDF?: {
      unit?: 'pt' | 'mm' | 'cm' | 'in' | 'px' | 'pc' | 'em' | 'ex'
      format?:
        | 'a0'
        | 'a1'
        | 'a2'
        | 'a3'
        | 'a4'
        | 'a5'
        | 'a6'
        | 'a7'
        | 'a8'
        | 'a9'
        | 'a10'
        | 'letter'
        | 'legal'
        | [number, number]
      orientation?: 'portrait' | 'landscape'
      [key: string]: unknown
    }
    pagebreak?: {
      mode?: string | string[]
      before?: string | string[]
      after?: string | string[]
      avoid?: string | string[]
    }
    enableLinks?: boolean
  }

  interface Html2Pdf {
    from(element: HTMLElement | string): Html2Pdf
    set(options: Html2PdfOptions): Html2Pdf
    save(filename?: string): Promise<void>
    output(
      type: 'blob' | 'datauristring' | 'arraybuffer',
      options?: unknown,
    ): Promise<Blob | string | ArrayBuffer>
    outputPdf(type?: string): Promise<unknown>
    outputImg(type?: string): Promise<unknown>
    toPdf(): Html2Pdf
    get(type: string): Promise<unknown>
  }

  function html2pdf(): Html2Pdf
  function html2pdf(
    element: HTMLElement | string,
    options?: Html2PdfOptions,
  ): Promise<void>

  export = html2pdf
}
