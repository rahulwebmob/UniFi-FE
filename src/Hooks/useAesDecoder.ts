import CryptoJS from 'crypto-js'
import { useSelector } from 'react-redux'

const secretKey = import.meta.env.VITE_AES_SECRET_KEY || ''

const useAesDecoder = (encodedText: string) => {
  const { user } = useSelector((state: any) => state.user)
  const userId = user?._id || null

  // decryption function
  const decrypt = () => {
    try {
      if (!secretKey || !userId) {
        console.warn('Missing secretKey or userId for decryption')
        return encodedText
      }
      
      const ivone = userId
      const ivfirst = ivone.padEnd(32, '0').slice(0, 32)
      const iv = CryptoJS.enc.Hex.parse(ivfirst)
      const bytes = CryptoJS.AES.decrypt(
        encodedText,
        CryptoJS.enc.Utf8.parse(secretKey),
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        },
      )
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      
      // If decryption fails or returns empty, return original text
      return decrypted || encodedText
    } catch (error) {
      console.error('Decryption error:', error)
      return encodedText
    }
  }

  return encodedText && userId && secretKey ? decrypt() : encodedText
}

export default useAesDecoder