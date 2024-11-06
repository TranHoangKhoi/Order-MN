import moment from 'moment'

export const Utils = {
  formatDateToString: (s: any, formatString = 'DD/MM/YYYY') => moment(s).format(formatString),
  formatStringToDate: (s: any, formatString = 'DD/MM/YYYY') => moment(s, formatString),
  addCommas: (nStr: any) => {
    nStr = parseFloat(nStr).toFixed(0)
    nStr += ''
    let x = nStr.split('.')
    let x1 = x[0]
    let x2 = x.length > 1 ? '.' + x[1] : ''
    let rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2')
    }
    return x1 + x2
  },
  getURLParameters: (url: any) =>
    [...new URL(url).searchParams].reduce(
      (obj, [key, value]: any) => ((obj[key] = key in obj ? [].concat(obj[key], value) : value), obj),
      Object.create(null),
    ),
  removeUrlParameter: (key: any, sourceURL: any) => {
    var rtn = sourceURL.split('?')[0],
      param,
      params_arr = [],
      queryString = sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : ''
    if (queryString !== '') {
      params_arr = queryString.split('&')
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split('=')[0]
        if (param === key) {
          params_arr.splice(i, 1)
        }
      }
      rtn = rtn + '?' + params_arr.join('&')
    }
    return rtn
  },
  formatProductData: (data: any) => {
    let result: any = ''
    const { productMeta, productSKU } = data

    const Property = () => {
      try {
        return productSKU.selectedSKU
          .map((item: any) => {
            return item.props.title
          })
          .join('; ')
      } catch (error) { }

      return ''
    }
    const PropertyValue = () => {
      try {
        return productSKU.selectedSKU
          .map((item: any) => {
            return item.props.value
          })
          .join(';')
      } catch (error) { }

      return ''
    }
    const stock = () => {
      return !!productSKU.stock.match(/\d+/g)[0] ? productSKU.stock.match(/\d+/g)[0] : 0
    }
    result = {
      OrderTempID: '',
      productId: productMeta.productId || '',
      ProductName: productMeta.productName || '',
      Image: productSKU.img || '',
      LinkProduct: productMeta.linkOrigin,
      Property: Property(),
      Brand: productMeta.note || '',
      Quantity: productMeta.quantity,
      ProviderID: productMeta.provider.id,
      ProviderName: productMeta.provider.name,
      PriceCNY: productSKU.price,
      PropertyValue: PropertyValue(),
      stock: stock(),
      pricestep: productMeta.priceStep || '',
    }

    return result
  },
}
