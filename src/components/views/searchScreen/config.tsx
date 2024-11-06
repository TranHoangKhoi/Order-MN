export const webViewURLs = {
  taobao: {
    targetUrl: 'https://m.intl.taobao.com/',
    searchUrl: 'https://m.intl.taobao.com/search/search.html?q=',
    detailUrl:
      'm.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb',
  },
  tmall: {
    targetUrl: 'https://www.tmall.com/',
    searchUrl: 'https://list.tmall.com/search_product.htm?q=',
    detailUrl:
      'm.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb',
  },
  '1688': {
    targetUrl: 'https://m.1688.com/',
    searchUrl: 'https://m.1688.com/offer_search/-6D7033.html?sortType=pop&keywords=',
    detailUrl:
      'm.intl.taobao.com/detail|item.taobao.com/item|a.m.taobao.com/|detail.m.tmall.com/item|tmall.hk/item.htm?id|detail.tmall.com/item|m.1688.com/offer|detail.m.1688.com/|dj.1688.com/ci_bb',
  },
};


export const toggleOrderJS = {
  1688: `
        if (!!document.querySelector('.takla-wap-b2b-skuselector-component')) {
            if (
            getComputedStyle(document.querySelector('.takla-wap-b2b-skuselector-component')).display ===
            'block'
            ) {
            document
                .querySelector('.takla-wap-b2b-skuselector-component .component-sku-selector-mask')
                .click();
            } else {
            document.querySelector('#widget-wap-detail-common-sku .J_SkuBtn').click();
            }
        } else if (!!document.querySelector('#widget-wap-detail-common-sku .J_SkuBtn')) {
            document.querySelector('#widget-wap-detail-common-sku .J_SkuBtn').click();
        } else if (!!document.querySelector('.specs-wrapper .specs-info')) {
            document.querySelector('.specs-wrapper .specs-info').click();
            if (!!document.querySelector('.mt-modal--bottom .mt-modal-mask')) {
            document.querySelector('.mt-modal--bottom .mt-modal-mask').dispatchEvent(new Event('touchend'));
            } else {
            document.querySelector('.specs-wrapper .specs-info').click();
            }
        }
    `,
};

export const detailJS = {
  TAOBAO: `(() => {
    function getProductPropsData() {
      const getUrlParameter = (name, url) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(url);
        if (results) {
          return decodeURIComponent(results[1]);
        } else {
          return '';
        }
      };
      const removeUrlParameter = (key, sourceURL) => {
        var rtn = sourceURL.split('?')[0],
          param,
          params_arr = [],
          queryString =
            sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : '';
        if (queryString !== '') {
          params_arr = queryString.split('&');
          for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split('=')[0];
            if (param === key) {
              params_arr.splice(i, 1);
            }
          }
          rtn = rtn + '?' + params_arr.join('&');
        }
        return rtn;
      };
  
      let arraySKuCont = (() => {
        let result = [];
        if (document.querySelectorAll('.split > .card.sku .modal-sku-content')) {
          result = Array.from(
            document.querySelectorAll('.split > .card.sku .modal-sku-content'),
          );
        }
        return result;
      })();
      let currentSKUArray = arraySKuCont.map((element) => {
        let result = '';
  
        let arrayProps = Array.from(
          element.querySelectorAll('.modal-sku-content-item'),
        ).map((item) => {
          let propValue = (() => {
            return item.dataset.vid;
          })();
          return {
            title: item.textContent,
            isSelected: item.className.includes('active'),
            value: propValue,
          };
        });
  
        result = {
          title: element.querySelector('.modal-sku-content-title').textContent,
          props: arrayProps,
        };
        return result;
      });
  
      let skuImg = () => {
        let el = document.querySelector('.modal-sku-image img');
        if (!el) el = document.querySelector('.sku-wrap .header .img-wrap img');
        if (!el) el = document.querySelector('.carousel img');
        return !!el ? el.src : '';
      };
      let skuPrice = () => {
        let els = document.querySelector('.modal-sku-title-price');
        if (!!els) return els.textContent.trim();
        els = document.querySelector('.price-wrap .price');
        if (!!els) return els.textContent.trim();
        return '';
      };
  
      let pdName = () => {
        let el = document.querySelector('.title-wrapper .title');
        if (!!el) return el.textContent.trim();
        el = document.querySelector('.main.cell');
        return !!el ? el.textContent.trim() : '';
      };
      let providerId = () => {
        let el = document.querySelector('.shop-link-item');
        if (el) return getUrlParameter('user_id', el.href);
        el = document.querySelector('.mui-shopactivity-item a');
        return !!el ? getUrlParameter('sellerId', el.href) : '';
      };
      let providerName = () => {
        if (document.querySelector('.shop-title-text'))
          return document.querySelector('.shop-title-text').textContent.trim();
        if (document.querySelector('.shop-name'))
          return document.querySelector('.shop-name').textContent.trim();
        return '';
      };
      let quantity = () => {
        if (document.querySelector('.sku-number-edit'))
          return document.querySelector('.sku-number-edit').value;
  
        if (document.querySelector('#number'))
          return document.querySelector('#number').value;
  
        return '1';
      };
      let itemId = () => {
        return getUrlParameter('id', location.href);
      };
      let stock = () => {
        let returnValue = '';
        if (document.querySelector('.stock')) {
          returnValue = document.querySelector('.stock').textContent.trim();
        }
  
        if (document.querySelector('.modal-sku-title-quantity')) {
          returnValue = document
            .querySelector('.modal-sku-title-quantity')
            .textContent.trim();
        }
        //returnValue = returnValue.match(/\d+/g)[0];
  
        return returnValue;
      };
      let linkOrigin = () => {
        let result = '';
        result = location.href;
        if (result.includes('#modal=sku')) {
          result = result.split('#')[0];
        }
        return result;
      };
      let priceStep = () => {
        return '';
      };
  
      //sender data
      let inwebData = '';
      try {
        inwebData = {
          productMeta: {
            productName: pdName(),
            provider: {
              id: providerId(),
              name: providerName(),
            },
            quantity: quantity(),
            productId: itemId(),
            linkOrigin: linkOrigin(),
          },
          productSKU: {
            list: currentSKUArray,
            img: skuImg(),
            price: skuPrice(),
            priceStep: priceStep(),
            stock: stock(),
          },
        };
      } catch (error) {
        // inwebData = error;
      }
  
      let data = { action: 'GET_PRODUCT_PROPS_TB', data: inwebData };
      return data;
    }
  
    if (typeof getProductPropsData !== 'undefined') {
      window.ReactNativeWebView.postMessage(
        JSON.stringify(getProductPropsData()),
      );
    } else {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: 'GET_PRODUCT_PROPS_TB', data: '' }),
      );
    }
  })()`,

  '1688': `(() => {
    function getProductPropsData() {
           let priceStep = () => {
  if (Array.from(document.querySelectorAll(".step-price-item")).length > 0) {
    let skuRangePrices = Array.from(document.querySelectorAll(".step-price-item"));
    let skuRangePricesString = skuRangePrices.map((item) => {
      let _price = '';
      let _unit = '';
      _price = item.querySelector(".price-text").textContent.trim() || '';
      _unit = item.querySelector(".unit-text").textContent.trim() || "";
      return {
        PriceText: _price,
        unitText: _unit,
      };
    });
    return skuRangePricesString;
  } else {
    let _price = document.querySelector(".price-text").textContent.trim();
    let _unit = document.querySelector(".unit-text").textContent.trim() || "";
    const data = [{
      PriceText: _price,
      unitText: _unit,
    }];
    return data;
  }
};
      
      let priceStepData = () => {
        let rangeEls = document.querySelectorAll('.d-price-rangecount dd');
        let priceEls = document.querySelectorAll('.d-price-discount dd');
        rangeEls = Array.from(rangeEls).map((el) => {
          return el.textContent.trim();
        });
        priceEls = Array.from(priceEls).map((el) => {
          return el.textContent.trim();
        });
        if (rangeEls.length > 0 && priceEls.length > 0)
          return (
            rangeEls.toArray().toString() + '|' + priceEls.toArray().toString()
          );
  
        if (rangeEls.length == 0 && priceEls.length == 0) {
          let infoEls = document.querySelectorAll('.J_SkuPriceItem');
          if (infoEls.length > 0) {
            infoEls = Array.from(infoEls).map((el, i) => {
              if (
                !!el.querySelector('.price-num') &&
                !!!!el.querySelector('.price-beigin-amount')
              ) {
                let beginamountString = el
                  .querySelector('.price-beigin-amount')
                  .textContent.trim();
                beginamountString = beginamountString.replace(
                  /[^\x20-\x7E]/g,
                  '',
                );
                if (i === Array.from(infoEls).length - 1)
                  beginamountString = beginamountString + '-9999999';
                return (
                  beginamountString +
                  ':' +
                  el.querySelector('.price-num').textContent.trim()
                );
              }
              return '';
            });
            return infoEls.join('|');
          } else {
            let skuRangePrices = [
              ...GLOBAL_DATA.orderParamModel.orderParam.skuParam.skuRangePrices,
            ];
            let skuRangePricesString = skuRangePrices
              .map((item, index) => {
                if (index === skuRangePrices.length - 1) {
                  return item.beginAmount + '-9999999' + ':' + item.price;
                }
                return item.beginAmount != skuRangePrices[index + 1].beginAmount
                  ? item.beginAmount +
                      '-' +
                      (parseInt(skuRangePrices[index + 1].beginAmount) - 1) +
                      ':' +
                      item.price
                  : item.beginAmount + '-9999999' + ':' + item.price;
              }).join('|');
            return skuRangePricesString;
          }
        } else {
        }
      };

      let linkOrigin = () => {
        let result = '';
        result = location.href;
        if (result.includes('#modal=sku')) {
          result = result.split('#')[0];
        }
        return result;
      };

      let extendInfo = document.querySelector(".unit-text").textContent.trim() || "";
      let data = { action: 'GET_PRODUCT_PROPS_1688',

      data: GLOBAL_DATA,
      priceStep: priceStep() ,
      extendInfo: extendInfo,
      linkOrigin: linkOrigin(),
      priceStepData : priceStepData(),
      };
      return data;
    }
  
    if (typeof getProductPropsData !== 'undefined') {
      window.ReactNativeWebView.postMessage(
        JSON.stringify(getProductPropsData()),
      );
    } else {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: 'GET_PRODUCT_PROPS_1688', data: '' }),
      );
    }
  })()`,
};

