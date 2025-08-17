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
      useCORS?: boolean
      letterRendering?: boolean
      allowTaint?: boolean
      logging?: boolean
      width?: number
      height?: number
      x?: number
      y?: number
      scrollX?: number
      scrollY?: number
      windowWidth?: number
      windowHeight?: number
    }
    jsPDF?: {
      unit?: 'pt' | 'mm' | 'cm' | 'in' | 'px' | 'pc' | 'em' | 'ex'
      format?: 'a3' | 'a4' | 'a5' | 'letter' | 'legal' | [number, number]
      orientation?: 'portrait' | 'landscape'
      compress?: boolean
    }
    pagebreak?: {
      mode?: string | string[]
      before?: string | string[]
      after?: string | string[]
      avoid?: string | string[]
    }
  }

  interface Html2Pdf {
    from(element: HTMLElement | string): Html2Pdf
    set(options: Html2PdfOptions): Html2Pdf
    save(filename?: string): Promise<void>
    output(
      type: 'blob' | 'datauristring' | 'datauri',
      options?: unknown,
    ): Promise<Blob | string>
    outputPdf(
      type: 'blob' | 'datauristring' | 'datauri',
    ): Promise<Blob | string>
    outputImg(
      type: 'img' | 'datauristring' | 'datauri',
    ): Promise<HTMLImageElement | string>
    then<T>(callback: (pdf: Html2Pdf) => T): Promise<T>
    catch(callback: (error: Error) => void): Promise<void>
    toPdf(): Html2Pdf
    get(type: 'pdf' | 'image' | 'canvas'): Promise<unknown>
  }

  function html2pdf(): Html2Pdf
  function html2pdf(
    element: HTMLElement | string,
    options?: Html2PdfOptions,
  ): Promise<void>

  export = html2pdf
}
