import crypto from 'crypto-js'

exports.encryptAES = (message, key) => {
  /*
  let str = crypto.SHA256(message)
  let hashBase64 = str.toString(CryptoJS.enc.Base64)
  */
  let encrypt = crypto.AES.encrypt(message, key)
  return encrypt.toString()
}

exports.decryptAES = (message, key) => {
  /*
  let str = crypto.SHA256(message)
  let hashBase64 = str.toString(crypto.enc.Base64)
  let encrypt = crypto.AES.encrypt(message, hashBase64)
  */
  let decrypt = crypto.AES.decrypt(message, key)
  return decrypt.toString(crypto.enc.Utf8)
}
