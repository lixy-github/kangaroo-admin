import Vue from 'vue'
import CryptoJS from 'crypto-js'

const keyStr = 'bi_ecology_qwert'
export default {
  // 加密
  encrypt(word) {
    var key = CryptoJS.enc.Utf8.parse(keyStr)
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding
    }) // 加密模式为ECB，补码方式为ZeroPadding（也就是PKCS7）
    return encrypted.toString()
  },
  // 解密
  decrypt(word) {
    var key = CryptoJS.enc.Utf8.parse(keyStr)
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  }
}
