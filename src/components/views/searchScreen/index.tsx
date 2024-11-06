import { Alert, Image, Modal, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useInputState } from './useInputState'
import ProcessBar from './ProcessBar'
import { getFullUrl } from './getFullUrl'
import translate from './translate'
import { detailJS } from './config'
import { Utils } from './Utils'
import NoteModal from './NoteModal'
import Modal1688 from './Modal1688'
import { containerStyle, width } from '~/styles'
import { colors } from '~/utils'
import UrlInput from './UrlInput'
import { RefreshWebView } from '~/components/global/webview/RefreshWebView'

// tk taobao : dungpq94 - BuiDoiVl@123

const SearchScreen = () => {
  const [wvUrl, setUrl] = useState('')
  const urlInputState = useInputState('https://m.intl.taobao.com/')
  const [wvProcess, setWvProcess] = useState(0)
  const [isRefresh, setRefresh] = useState(false)
  const webview = useRef<any>(null)
  const [isDetail, setDetail] = useState(false)
  const [atc_Loading, setAtc_Loading] = useState(false)
  const noteInputState = useInputState('')

  const [Array1688, setArray1688] = useState<any>([])
  const [priceStep, setPriceStep] = useState<any>([])
  const [data1688, setData1688] = useState<any>()
  const [extendInfo, setExtendInfo] = useState<any>('')
  const [showModal168, setShowModal1688] = useState<any>(false)

  const [showSearch, setShowSearch] = useState(false)
  const [urlSearch, setUrlSearch] = useState('')
  const [searchText, setSearchText] = useState('')

  const [loadPage, setLoadPage] = useState(false)

  const _onSubmitEditingUrlInput = async () => {
    if (urlInputState.value.includes('https://')) {
      if (urlInputState.value.includes('taobao')) {
        setUrl(getFullUrl(urlInputState.value))
      } else if (urlInputState.value.includes('tmall')) {
        setUrl(getFullUrl(urlInputState.value))
      } else if (urlInputState.value.includes('1688')) {
        setUrl(getFullUrl(urlInputState.value))
      } else {
        Alert.alert('Link không có nằm trong các sàn thương mại')
      }
    } else {
      let translateValue: any = ''

      try {
        translateValue = await translate(urlInputState.value, { to: 'zh-cn' })
      } catch (error) {
        // console.log('error_1: ', error)
      }
      let searchTexts = urlInputState.value

      try {
        searchTexts = translateValue[0][0][0]
      } catch (error) {
        // console.log('error_2: ', error)
      }

      if (!!searchTexts) {
        setShowSearch(true)
        setSearchText(searchTexts)
      }
    }
  }

  useEffect(() => {
    if (urlSearch.includes('taobao')) {
      setUrl('https://m.intl.taobao.com/search/search.html?q=' + searchText)
    } else if (urlSearch.includes('tmall')) {
      setUrl('https://list.tmall.com/search_product.htm?q=' + searchText)
    } else if (urlSearch.includes('1688')) {
      setUrl('https://m.1688.com/offer_search/-6D7033.html?keywords=' + searchText)
    } else {
      setUrl('')
    }
  }, [searchText, urlSearch])

  const _onRef = () => {
    setRefresh(true)
    webview.current.reload()
    setRefresh(false)
  }

  const _onLoadProgress = ({ nativeEvent }: any) => {
    setWvProcess(nativeEvent.progress * 100)
  }

  const Check_detailUrl = () => {
    if (wvUrl.includes('taobao')) {
      return 'm.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb'
    }
    if (wvUrl.includes('tmall')) {
      return 'm.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb'
    }
    if (wvUrl.includes('1688')) {
      return 'm.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb'
    }
    return ''
  }

  const _onNavigationStateChange = (newNavState: any) => {
    const { url } = newNavState
    if (!url) return
    urlInputState.onChangeText(url)
    let checkDt = Check_detailUrl()
      .toString()
      .trim()
      .split('|')
      .some((s: any) => urlInputState.value.includes(s))
    setDetail(checkDt)
    if (loadPage) {
      const hideAndClickScript = `
    var elementToHide = document.querySelectorAll(".toWapOd")[0];
    if (elementToHide) {
        elementToHide.style.display = 'none';
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('click', true, true);
        elementToHide.dispatchEvent(clickEvent);
    }
`
      webview.current.injectJavaScript(hideAndClickScript)
    }
    if (checkDt) {
      url.includes('taobao') &&
        webview.current.injectJavaScript(`
                if(document.querySelectorAll(".bar").length > 0){
                    document.querySelectorAll(".bar")[0].style.display = 'none';   
                }
                if(document.querySelectorAll(".sku.card .modal-btn-wrapper").length > 0){
                    document.querySelectorAll(".sku.card .modal-btn-wrapper")[0].style.display = 'none'
                }
            `)
      url.includes('tmall') && webview.current.injectJavaScript(``)

      url.includes('1688') &&
        webview.current.injectJavaScript(`
         if(document.querySelectorAll(".detail-footer").length > 0){
            document.querySelectorAll(".detail-footer")[0].style.display = 'none'
        } 
        `)
    }
  }

  const _onPressOrderProps = () => {
    /// xem thuộc tính
    if (isDetail) {
      if (webview.current) {
        if (urlInputState.value.includes('taobao')) {
          webview.current.injectJavaScript(
            `if(document.querySelectorAll(".split > .card.sku .modal-mask-enter").length > 0){
                    document.querySelectorAll(".split > .card.sku .modal-mask-enter")[0].click();
                } else {
                    document.querySelectorAll(".split > .card.sku")[0].click();
                }`,
          )
        }
        if (urlInputState.value.includes('tmall')) {
          webview.current.injectJavaScript(`document.querySelector('.specs-wrapper .specs-info').click();`)
        }
        if (urlInputState.value.includes('1688')) {
          SENDMESS_getCurrentProductProps()
          setShowModal1688(true)
        }
      }
    }
  }

  const SENDMESS_getCurrentProductProps = () => {
    const injectJs = (() => {
      if (urlInputState.value.includes('taobao')) {
        return detailJS.TAOBAO
      }
      if (urlInputState.value.includes('tmall')) {
        return detailJS.TAOBAO
      }
      if (urlInputState.value.includes('1688')) {
        setShowModal1688(true)
        return detailJS['1688']
      }
      return ''
    })()
    webview.current.injectJavaScript(injectJs)
  }

  const _onPressOrderAddToCart = () => {
    if (isDetail) {
      if (webview.current) {
        if (urlInputState.value.includes('taobao')) {
          webview.current.injectJavaScript(`if(document.querySelectorAll(".bar").length > 0){
                    document.querySelectorAll(".bar")[0].style.display = 'none';   
                }
                if(document.querySelectorAll(".sku.card .modal-btn-wrapper").length > 0){
                    document.querySelectorAll(".sku.card .modal-btn-wrapper")[0].style.display = 'none'
                }`)
          SENDMESS_getCurrentProductProps()
        }

        if (urlInputState.value.includes('tmall')) {
          webview.current.injectJavaScript(`document.querySelector('.specs-wrapper .specs-info').click();`)
          SENDMESS_getCurrentProductProps()
        }

        if (urlInputState.value.includes('1688')) {
          webview.current.injectJavaScript(`
              if(document.querySelectorAll(".detail-footer").length > 0){
                document.querySelectorAll(".detail-footer")[0].style.display = 'none'}
              `)
          SENDMESS_getCurrentProductProps()
          setShowModal1688(true)
        }
      }
    }
  }

  const ApiCALL_addToCart = async (formatData: any) => {
    console.log('formatData: ', formatData);
    
    setAtc_Loading(true)
    try {
      const data = {
        title_origin: formatData.ProductName,
        title_translated: formatData.ProductName,
        price_origin: formatData.PriceCNY,
        price_promotion: formatData.PriceCNY,
        property_translated: formatData.Property + ';',
        property: formatData.Property,
        data_value: formatData.PropertyValue + ';',
        image_model: formatData.Image,
        image_origin: formatData.Image,
        shop_id: formatData.ProviderID,
        shop_name: formatData.ProviderName,
        seller_id: formatData.ProviderID,
        wangwang: formatData.ProviderName,
        quantity: formatData.Quantity,
        stock: formatData.stock,
        location_sale: '',
        site: (() => {
          if (formatData.LinkProduct.includes('taobao')) return 'TAOBAO'
          if (formatData.LinkProduct.includes('tmall')) return 'TMALL'
          if (formatData.LinkProduct.includes('1688')) return '1688'
          return ''
        })(),
        comment: '',
        item_id: formatData.productId,
        link_origin: encodeURIComponent(formatData.LinkProduct),
        outer_id: '',
        error: '',
        weight: '',
        step: '',
        pricestep: (() => {
          if (formatData.LinkProduct.includes('1688')) {
            return !!formatData.pricestep ? formatData.pricestep + '|' : ''
          }
          return ''
        })(),
        brand: formatData.Brand,
        category_name: 'Đang cập nhật',
        category_id: 1,
        tool: Platform.OS,
        version: '',
        is_translate: false,
      }
      // console.log("data: ", data);
    } catch (error) {
      // console.log(error)
    }
    setAtc_Loading(false)
  }

  const _onMessage = async (e: any) => {
    if (isDetail) {
      const res = JSON.parse(e.nativeEvent.data)
      switch (res.action) {
        case 'GET_PRODUCT_PROPS_TB':
          if (!res.data) return
          const metaData = res.data.productMeta
          const productData = res.data.productSKU
          //mua lẻ
          if (productData.stock.match(/\d+/g)[0] === '0') {
            Alert.alert('Thông Báo', 'Sản phẩm này đã hết hàng.')
            break
          }

          const isSelectedAll = productData.list
            .map((item: any) => {
              const tmp = item.props.some((item: any) => item.isSelected)

              return tmp
            })
            .every(Boolean)

          if (isSelectedAll) {
            //run add to cart
            const selectedSKU = productData.list.map((item: any) => {
              const tmp = item.props.filter((item: any) => item.isSelected)
              return {
                title: item.title,
                props: tmp[0],
              }
            })

            productData.selectedSKU = selectedSKU
            metaData.note = noteInputState.value
            let formatData = Utils.formatProductData(res.data)
            try {
              ApiCALL_addToCart(formatData)
            } catch (error) {
            } finally {
              Alert.alert('Lên đơn hàng thành công', 'Qua trang giỏ hàng', [
                { text: 'Tiếp tục mua' },
                { text: 'OK', onPress: () => { } },
              ])
            }
          } else {
            Alert.alert('Thông Báo', 'Vui lòng chọn đủ các thuộc tính sản phẩm(mẫu mã, kích cỡ, màu sắc, số lượng,...)')
          }
          break

        case 'GET_PRODUCT_PROPS_1688':
          const skuModel = res.data.skuModel
          const Property = res.data?.skuModel?.skuProps[1]?.value[0]?.name
          setData1688({
            ...res.data,
            linkOrigin: res.linkOrigin,
            priceStepData: res.priceStepData,
            Property: Property || '',
          })

          if (res.priceStep.length > 0) {
            setPriceStep(res.priceStep)
          }

          if (!!res.extendInfo) {
            setExtendInfo(res.extendInfo)
          }

          if (!!skuModel.skuInfoMapOriginal) {
            const imgArray = skuModel.skuProps[0].value || []
            const skuInfoMapOriginal = Object.values(skuModel.skuInfoMapOriginal) || []

            const AllArray: any = skuInfoMapOriginal.map((item: any) => {
              const { specAttrs } = item
              let arr = specAttrs?.split('&gt;')
              if (arr.length > 1) {
                let result = arr[0]?.trim()
                const priceInfo = imgArray.find((item: any) => item.name === result)
                const imageUrl = priceInfo ? priceInfo.imageUrl : null
                const specAttrs = arr[1].trim()
                return { ...item, imageUrl, specAttrs, quantity: 0 }
              } else {
                const priceInfo = imgArray.find((item: any) => item.name === specAttrs)
                const imageUrl = priceInfo ? priceInfo.imageUrl : null
                return { ...item, imageUrl, quantity: 0 }
              }
            })
            setArray1688(AllArray)
          } else {
            setArray1688([
              {
                canBookCount: 500,
                discountPrice: '',
                imageUrl: res.data.shareModel.picUrl,
                isPromotionSku: false,
                price: '',
                quantity: 0,
                saleCount: 0,
                skuId: 0,
                specAttrs: '',
                specId: '',
              },
            ])
          }
          break
        default:
          // console.log('_onMessage res: chưa handle action hoặc thiếu key action')
          break
      }
    }
  }

  return (
    <View style={containerStyle.fullAround}>
      <View style={[styles.wvHeader, styles.rowContainer]}>
        <UrlInput
          values={urlInputState.value}
          placeholder="Tìm kiếm từ khóa"
          multiline={false}
          placeholderTextColor="#ccc"
          style={[styles.inputCanCle, { flexGrow: 2, width: 6 }]}
          selectTextOnFocus={true}
          isSelectionOnTouch={true}
          onSubmitEditing={_onSubmitEditingUrlInput}
          {...urlInputState}
        />

        <TouchableOpacity
          onPress={() => urlInputState.setValue('')}
          activeOpacity={0.7}
          style={{ paddingLeft: 16 }}
        >
          <Text
            style={{
              fontSize: 16,
              color: '#fff',
              fontWeight: 'bold',
            }}>
            Hủy
          </Text>
        </TouchableOpacity>
      </View>
      <ProcessBar percent={wvProcess} />

      <View style={styles.pageContent}>
        <RefreshWebView
          isRefresh={isRefresh}
          onRefresh={_onRef}
          ref={webview}
          style={{ marginTop: 0 }}
          source={{ uri: "https://reactnative.dev/" }}
          onNavigationStateChange={_onNavigationStateChange}
          onMessage={_onMessage}
          onLoadProgress={_onLoadProgress}
          javaScriptEnabled={true}
          setLoadPage
          onLoadEnd={() => {
            setLoadPage(true)
          }}
          cacheEnabled={false}
          cacheMode={'LOAD_NO_CACHE'}
          javaScriptEnabledAndroid={true}
        />
      </View>

      {!!wvUrl && wvProcess >= 70 && isDetail && (
        <>
          <View style={[styles.BottomBtnGroup, styles.rowContainer]}>
            <View style={styles.btnWrap}>
              <TouchableOpacity style={[styles.btn]} onPress={_onPressOrderProps}>
                <Text style={styles.btnTxt}>Xem thuộc tính</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnWrap}>
              <NoteModal input={noteInputState} />
            </View>
            <View style={styles.btnWrap}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: 'green' }]}
                onPress={atc_Loading ? () => { } : _onPressOrderAddToCart}>
                <Text style={styles.btnTxt}>{atc_Loading ? 'Đang xử lý' : 'Đặt hàng'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View />
        </>
      )}
      <Modal1688
        filter={showModal168}
        setFilter={setShowModal1688}
        data1688={data1688}
        priceStep={priceStep}
        Array1688={Array1688}
        extendInfo={extendInfo}
        noteInputState={noteInputState}
        ApiCall_addToCart={ApiCALL_addToCart}
        setAtc_Loading={setAtc_Loading}
        cartState={undefined}
      />
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
  },
  inputCanCle: {
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    lineHeight: 20,
    borderRadius: 8,
    marginLeft: 8,
  },
  text: {},
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wvHeader: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  BottomBtnGroup: {
    padding: 5,
    paddingVertical: 16,
    paddingBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    lineHeight: 20,
    borderRadius: 4,
  },
  focus: {
    width: '60%',
    flexGrow: 20,
  },
  wvArrowBtn: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 20,
    minWidth: 48,
    minHeight: 48,
  },
  btnWrap: {
    flexGrow: 1,
    margin: 2.5,
  },
  btn: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  btnTxt: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    lineHeight: 20,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pageContent: {
    flex: 1,
  },
  orderPageList: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 8,
    alignItems: 'center',
  },
  btnPageOrderX: {
    padding: 5,
  },
  btnPageOrder: {
    padding: 8,
    backgroundColor: colors.black,
    borderRadius: 8,
    marginRight: 8,
  },
  imgBtnOrder: {
    height: 3,
    width: 8,
  },
})
