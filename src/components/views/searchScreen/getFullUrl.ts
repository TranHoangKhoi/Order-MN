/* eslint-disable semi */
// LẤY URL CÓ CHỨA KÝ TỰ LẠ
export const getFullUrl = (url: any) => {
  let temp = ''
  let flag = 0
  if (url === undefined || url === null || url === '') {
    return '' // https://m.1688.com/
  } else {
    if (url[0] === 'h' && url[1] === 't' && url[2] === 't' && url[3] === 'p') {
      return url.replace('modal=sku', '')
    } else {
      for (let i = 0; i < url.length; i++) {
        // URL CÓ CHỨA HTTP
        if (url[i] === 'h' && url[i + 1] === 't' && url[i + 2] === 't' && url[i + 3] === 'p') {
          flag = 1
        }
        // GHI ĐOẠN CÓ HTTP LẠI
        if (flag === 1) {
          temp = temp + url[i]
        }
        // KẾT THÚC CÁI HTTP THÌ NGƯNG GHI
        if (url[i + 1] === ' ') {
          flag = 0
        }
      }
      return temp.replace('modal=sku', '')
    }
  }
}
