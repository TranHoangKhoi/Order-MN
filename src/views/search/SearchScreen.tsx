import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { EvilIcon, ProcessBar } from '~/components'
import { RefreshWebView } from '~/components/global/webview/RefreshWebView'
import Modal1688 from '~/components/views/searchScreen/Modal1688'
import UrlInput from '~/components/views/searchScreen/UrlInput'
import { detailJS, settings } from '~/configs'
import { DefaultLayout } from '~/layout'
import { _func, colors } from '~/utils'
import translate from '~/utils/translation/Translation'

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const useCartState = (initialValue = '') => {
  const [data, setData] = React.useState(initialValue);
  const [loading, setLoading] = React.useState(false);

  return { data, setData: setData, isLoading: loading, setLoading: setLoading };
};

const addProductAsync = async data => {
  let userCart;
  try {
    userCart = await AsyncStorage.getItem('userCart');
    userCart = JSON.parse(userCart);
    // await AsyncStorage.removeItem('userCart')
  } catch (error) {
    //get cart data fail
  }

  if (userCart) {
    if (userCart.some(item => item.OrderShopID === data.ProviderID)) {
      //merge shop data
      for (const item of userCart) {
        if (item.OrderShopID === data.ProviderID) {
          const listProduct = item.ListProduct;
          if (
            listProduct.some(item => item.PropertyValue === data.PropertyValue)
          ) {
            for (const pd of listProduct) {
              if (pd.PropertyValue === data.PropertyValue) {
                pd.Quantity = parseInt(pd.Quantity) + parseInt(data.Quantity);
                await AsyncStorage.setItem(
                  'userCart',
                  JSON.stringify(userCart),
                );
                return;
              }
            }
          } else {
            listProduct.push({
              OrderTempID: '',
              ProductName: data.ProductName,
              productId: data.productId,
              Image: data.Image,
              LinkProduct: data.LinkProduct,
              Property: data.Property,
              PropertyValue: data.PropertyValue,
              Brand: data.Brand,
              // PriceVN: "268,600",
              PriceCNY: data.PriceCNY,
              pricestep: data.pricestep,
              // TotalPriceVN: "268,600",
              // TotalPriceCNY: "79",
              Quantity: data.Quantity,
              stock: data.stock,
            });
            await AsyncStorage.setItem('userCart', JSON.stringify(userCart));
          }

          return;
        }
      }
    } else {
      const ListNewProduct = () => {
        let rs: any = '';
        rs = [
          {
            OrderTempID: '',
            productId: data.productId,
            ProductName: data.ProductName,
            Image: data.Image,
            LinkProduct: data.LinkProduct,
            Property: data.Property,
            PropertyValue: data.PropertyValue,
            Brand: data.Brand,
            // PriceVN: "268,600",
            PriceCNY: data.PriceCNY,
            pricestep: data.pricestep,
            // TotalPriceVN: "268,600",
            // TotalPriceCNY: "79",
            Quantity: data.Quantity,
            stock: data.stock,
          },
        ];
        return rs;
      };
      userCart.push({
        OrderShopID: data.ProviderID,
        OrderShopName: data.ProviderName,
        IsCheckProduct: false,
        IsCheckPacked: false,
        IsCheckFastDelivery: false,
        Note: '',
        ListProduct: ListNewProduct(),
      });
      await AsyncStorage.setItem('userCart', JSON.stringify(userCart));
    }
  } else {
    await AsyncStorage.setItem(
      'userCart',
      JSON.stringify([
        {
          OrderShopID: data.ProviderID,
          OrderShopName: data.ProviderName,
          IsCheckProduct: false,
          IsCheckPacked: false,
          IsCheckFastDelivery: false,
          Note: '',
          ListProduct: [
            {
              OrderTempID: '',
              ProductName: data.ProductName,
              Image: data.Image,
              LinkProduct: data.LinkProduct,
              Property: data.Property,
              PropertyValue: data.PropertyValue,
              Brand: data.Brand,
              PriceCNY: data.PriceCNY,
              Quantity: data.Quantity,
              pricestep: data.pricestep,
              stock: data.stock,
              productId: data.productId,
            },
          ],
        },
      ]),
    );
  }
};

export const SearchScreen = () => {
  const routes = useRoute<any>();
  const webview = useRef(null);
  const { targetUrl, searchUrl, detailUrl } = routes.params;

  const [wvUrl, setUrl] = useState(targetUrl);
  const [isRefresh, setRefresh] = useState(false);

  const [wvProcess, setWvProcess] = useState(0);
  const [isDetail, setDetail] = useState(false);
  const [isShowCart, setIsShowCart] = useState(false);
  const [atc_Loading, setAtc_Loading] = useState(false);
  const urlInputState = useInputState(wvUrl);
  const searchInputState = useInputState('');
  const noteInputState = useInputState('');
  const cartState: any = useCartState('');

  const [Array1688, setArray1688] = useState([]);
  const [priceStep, setPriceStep] = useState([]);
  const [data1688, setData1688] = useState();
  const [extendInfo, setExtendInfo] = useState('');
  const [showModal168, setShowModal1688] = useState(false);

  useEffect(() => {
    if (cartState.data) {
      setIsShowCart(true);
    }
  }, [cartState.data]);

  const _onRef = () => {
    setRefresh(true);
    webview.current.reload();
    setRefresh(false);
  };

  const SendMess_getCurrentProductProps = () => {
    const injectJs = (() => {
      if (urlInputState.value.includes('taobao')) {
        return detailJS.TAOBAO;
      }
      if (urlInputState.value.includes('tmall')) {
        return detailJS.TAOBAO;
      }
      if (urlInputState.value.includes('1688')) {
        setShowModal1688(true);
        return detailJS['1688'];
      }
      return '';
    })();
    webview.current.injectJavaScript(injectJs);
  };

  const _onSubmitEditingUrlInput = () => {
    setUrl(urlInputState.value.replace('modal=sku', ''));
  };

  const _onPressSearchURL = async () => {
    let translateValue: any = '';
    try {
      translateValue = await translate(searchInputState.value, { to: 'zh-cn' });
    } catch (error) { }
    let searchText = searchInputState.value;
    try {
      searchText = translateValue[0][0][0];
    } catch (error) { }
    setUrl(searchUrl + searchText);
  };

  const _onPressOrderProps = () => {
    if (isDetail) {
      if (webview.current) {
        urlInputState.value.includes('taobao') &&
          webview.current.injectJavaScript(
            `if(document.querySelectorAll(".split > .card.sku .modal-mask-enter").length > 0){
                    document.querySelectorAll(".split > .card.sku .modal-mask-enter")[0].click();
                } else {
                    document.querySelectorAll(".split > .card.sku")[0].click();
                }`,
          );
        if (urlInputState.value.includes('tmall')) {
          webview.current.injectJavaScript(
            "document.querySelector('.specs-wrapper .specs-info').click();",
          );
        }
        if (urlInputState.value.includes('1688')) {
          SendMess_getCurrentProductProps();
          setShowModal1688(true);
        }
      }
    }
  };

  const _onPressOrderAddToCart = () => {
    if (isDetail) {
      if (webview.current) {
        if (cartState.data.isLoading) {
        } else {
          if (urlInputState.value.includes('taobao')) {
            webview.current
              .injectJavaScript(`if(document.querySelectorAll(".bar").length > 0){
                    document.querySelectorAll(".bar")[0].style.display = 'none';   
                }
                if(document.querySelectorAll(".sku.card .modal-btn-wrapper").length > 0){
                    document.querySelectorAll(".sku.card .modal-btn-wrapper")[0].style.display = 'none'
                }`);
            SendMess_getCurrentProductProps();
          }

          if (urlInputState.value.includes('tmall')) {
            webview.current.injectJavaScript(
              "document.querySelector('.specs-wrapper .specs-info').click();",
            );
            SendMess_getCurrentProductProps();
          }

          if (urlInputState.value.includes('1688')) {
            webview.current.injectJavaScript(`
              if(document.querySelectorAll(".detail-footer").length > 0){
                document.querySelectorAll(".detail-footer")[0].style.display = 'none'}
              `);
            SendMess_getCurrentProductProps();
            setShowModal1688(true);
          }
        }
      }
    }
  };

  useEffect(() => {
    urlInputState.value.includes('1688') &&
      webview.current.injectJavaScript(`
         if(document.querySelectorAll(".detail-footer").length > 0){
            document.querySelectorAll(".detail-footer")[0].style.display = 'none'
        }
      `);
  }, [urlInputState]);

  const _onNavigationStateChange = newNavState => {
    const { url } = newNavState;
    if (!url) {
      return;
    }
    urlInputState.onChangeText(url);
    let checkDt = detailUrl
      .toString()
      .trim()
      .split('|')
      .some(s => url.includes(s));
    setDetail(checkDt);
    if (checkDt) {
      url.includes('taobao') &&
        webview.current.injectJavaScript(`
                if(document.querySelectorAll(".bar").length > 0){
                    document.querySelectorAll(".bar")[0].style.display = 'none';   
                }
                if(document.querySelectorAll(".sku.card .modal-btn-wrapper").length > 0){
                    document.querySelectorAll(".sku.card .modal-btn-wrapper")[0].style.display = 'none'
                }
            `);
      url.includes('tmall') && webview.current.injectJavaScript(' ');
    }
  };

  const ApiCall_addToCart = async formattedData => {
    setAtc_Loading(true);
    const data = {
      title_origin: formattedData.ProductName,
      title_translated: formattedData.ProductName,
      price_origin: formattedData.PriceCNY,
      price_promotion: formattedData.PriceCNY,
      property_translated: formattedData.specAttrs + ';',
      property: formattedData.specAttrs,
      data_value: formattedData.PropertyValue + ';',
      image_model: formattedData.Image,
      image_origin: formattedData.Image,
      shop_id: formattedData.ProviderID,
      shop_name: formattedData.ProviderName,
      seller_id: formattedData.ProviderID,
      wangwang: formattedData.ProviderName,
      quantity: formattedData.Quantity,
      stock: formattedData.stock,
      location_sale: '',
      site: (() => {
        if (formattedData.LinkProduct.includes('taobao')) {
          return 'TAOBAO';
        }
        if (formattedData.LinkProduct.includes('tmall')) {
          return 'TMALL';
        }
        if (formattedData.LinkProduct.includes('1688')) {
          return '1688';
        }
        return '';
      })(),
      comment: '',
      item_id: formattedData.productId,
      link_origin: encodeURIComponent(formattedData.LinkProduct),
      outer_id: '',
      error: '',
      weight: '',
      step: '',
      pricestep: (() => {
        if (formattedData.LinkProduct.includes('1688')) {
          return formattedData.pricestep ? formattedData.pricestep + '|' : '';
        }
        return '';
      })(),
      brand: formattedData.Brand,
      category_name: 'Đang cập nhật',
      category_id: 1,
      tool: Platform.OS,
      version: '',
      is_translate: false,
    }
    console.log("data: ", data);
    cartState.setData(formattedData);
    setAtc_Loading(false);
  };

  const _onMessage = async e => {
    if (isDetail) {
      const res = JSON.parse(e.nativeEvent.data);
      switch (res.action) {
        case 'GET_PRODUCT_PROPS_TB':
          if (!res.data) {
            return;
          }
          const metaData = res.data.productMeta;
          const productData = res.data.productSKU;
          //mua lẻ
          if (productData.stock.match(/\d+/g)[0] === '0') {
            Alert.alert('Thông Báo', 'Sản phẩm này đã hết hàng.');
            break;
          }

          const isSelectedAll = productData.list
            .map(item => {
              const tmp = item.props.some(item => item.isSelected);

              return tmp;
            })
            .every(Boolean);

          if (isSelectedAll) {
            //run add to cart
            const selectedSKU = productData.list.map(item => {
              const tmp = item.props.filter(item => item.isSelected);
              return {
                title: item.title,
                props: tmp[0],
              };
            });
            productData.selectedSKU = selectedSKU;
            metaData.note = noteInputState.value;
            let formattedData = _func.formatProductData(res.data);
            if (false) {
              ApiCall_addToCart(formattedData);
            } else {
              setAtc_Loading(true);
              await addProductAsync(formattedData);
              cartState.setData(formattedData);
              setAtc_Loading(false);
            }
          } else {
            Alert.alert(
              'Thông Báo',
              'Vui lòng chọn đủ các thuộc tính sản phẩm(mẫu mã, kích cỡ, màu sắc, số lượng,...)',
            );
          }
          break;
        case 'GET_PRODUCT_PROPS_1688':
          const skuModel = res?.data?.skuModel;
          const Property = res.data?.skuModel?.skuProps[1]?.value[0]?.name;
          setData1688({
            ...res.data,
            linkOrigin: res.linkOrigin,
            priceStepData: res.priceStepData,
            Property: Property || '',
          });
          if (res.priceStep.length > 0) {
            setPriceStep(res.priceStep);
          }

          if (res.extendInfo) {
            setExtendInfo(res.extendInfo);
          }

          if (skuModel.skuInfoMapOriginal) {
            const imgArray = skuModel.skuProps[0].value || [];
            const skuInfoMapOriginal =
              Object.values(skuModel.skuInfoMapOriginal) || [];
            const AllArray = skuInfoMapOriginal.map((item: any) => {
              const { specAttrs }: any = item;
              let arr = specAttrs?.split('&gt;');
              if (arr.length > 1) {
                let result = arr[0]?.trim();
                const priceInfo = imgArray.find(item => item.name === result);
                const imageUrl = priceInfo ? priceInfo.imageUrl : null;

                return {
                  ...item,
                  imageUrl,
                  specAttrs: arr.join('; '),
                  quantity: 0,
                };
              } else {
                const priceInfo = imgArray.find(
                  item => item.name === specAttrs,
                );
                const imageUrl = priceInfo ? priceInfo.imageUrl : null;
                return { ...item, imageUrl, quantity: 0 };
              }
            });
            const skuProps = res.data?.skuModel?.skuProps[0]?.value;
            const check = res.data?.skuModel?.skuProps[0]?.value[0]?.imageUrl;
            if (check !== undefined) {
              AllArray.forEach(item => {
                const matchingItem = skuProps.find(
                  skuItem => skuItem.imageUrl === item.imageUrl,
                );
                if (matchingItem) {
                  item.Property = matchingItem.name;
                }
              });
              setArray1688(AllArray);
            } else {
              AllArray.forEach((item, index) => {
                if (skuProps[index]) {
                  item.Property = skuProps[index].name;
                }
              });
              setArray1688(AllArray);
            }
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
            ]);
          }
          break;
        default:
          console.log(
            '_onMessage res: chưa handle action hoặc thiếu key action',
          );
          break;
      }
    }
  };

  const _onLoadProgress = ({ nativeEvent }) => {
    setWvProcess(nativeEvent.progress * 100);
  };

  return (
    <DefaultLayout
      isShowBottomTab={false}
      containerOverrideStyle={styles.fragment}
    >
      <>
        <ProcessBar percent={wvProcess} />
        <View style={[styles.wvHeader, styles.rowContainer]}>
          <TouchableOpacity
            style={[styles.wvArrowBtn, { marginRight: 5 }]}
            onPress={() => webview.current?.goBack()}>
            <Text style={[styles.text, { color: '#fff' }]}>
              <EvilIcon name="arrow-left" size={25} />
            </Text>
          </TouchableOpacity>
          <UrlInput
            style={[styles.input, { flexGrow: 20, width: 40 }]}
            selectTextOnFocus={true}
            isSelectionOnTouch={true}
            onSubmitEditing={_onSubmitEditingUrlInput}
            keyboardType={settings.deviceOS === 'ios' ? 'default' : 'default'}
            {...urlInputState}
          />
          <UrlInput
            style={[styles.input, { flexGrow: 2, width: 40, marginLeft: 5 }]}
            placeholderTextColor="#ccc"
            placeholder="Nhập từ khoá tìm kiếm"
            autoCapitalize="none"
            {...searchInputState}
          />
          <TouchableOpacity
            style={[styles.wvArrowBtn, { marginLeft: 5 }]}
            onPress={_onPressSearchURL}>
            <Text style={[styles.text, { color: '#fff' }]}>
              <EvilIcon name="arrow-right" size={25} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pageContent}>
          <RefreshWebView
            isRefresh={isRefresh}
            onRefresh={_onRef}
            ref={webview}
            style={{ marginTop: 0 }}
            source={{ uri: wvUrl }}
            onNavigationStateChange={_onNavigationStateChange}
            onMessage={_onMessage}
            onLoadProgress={_onLoadProgress}
          />
        </View>
        {isDetail && wvProcess >= 75 && (
          <>
            <View style={[styles.BottomBtnGroup, styles.rowContainer]}>
              <View style={styles.btnWrap}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: 'green' }]}
                  onPress={_onPressOrderProps}>
                  <Text style={styles.btnTxt}>Xem thuộc tính</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnWrap}>
                <TouchableOpacity
                  style={[styles.btn, {}]}
                  onPress={atc_Loading ? () => { } : _onPressOrderAddToCart}>
                  <Text style={styles.btnTxt}>
                    {atc_Loading ? 'Đang xử lý' : 'Đặt hàng'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <SafeAreaView />
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
          ApiCall_addToCart={ApiCall_addToCart}
          setAtc_Loading={setAtc_Loading}
          cartState={cartState}
        />
      </>
    </DefaultLayout>
  )
}

const styles = ScaledSheet.create({
  fragment: {
    margin: 0,
    padding: 0,
  },
  text: {},
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wvHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 50
  },
  BottomBtnGroup: {
    padding: 5,
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    lineHeight: 20,
    borderRadius: 4,
    height: 40,
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
    minWidth: 40,
    minHeight: 40,
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
})