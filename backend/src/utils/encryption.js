import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'default_encryption_key_change_in_production'

// AES-256 加密
export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

// AES-256 解密
export const decrypt = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// 加密对象
export const encryptObject = (obj) => {
  const jsonString = JSON.stringify(obj)
  return encrypt(jsonString)
}

// 解密对象
export const decryptObject = (encryptedText) => {
  const jsonString = decrypt(encryptedText)
  return JSON.parse(jsonString)
}
