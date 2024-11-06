import moment from 'moment';
import { Alert } from 'react-native';
import { translateAPI } from '~/api/translate';
import { appConfigs } from '~/configs';
import { LocalStorage } from '../localStore';
import { logOutUser, setLogin } from '~/store';
import { TError } from '~/types';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

class Func {
  handleError = (error: TError, dispatch: Dispatch<AnyAction>) => {

    if (error.Code === '101' && error.Logout !== '1' && !error.Message) {
      Alert.alert('Đã xảy ra lỗi!', 'Vui lòng thử lại!');
      return
    }

    if (error.Logout === '1' && error.Message === '') {
      Alert.alert('Đã xảy ra lỗi!', 'Tài khoản của bạn đang đăng nhập nơi khác!')
      LocalStorage.logout();
      dispatch(logOutUser());
      dispatch(setLogin(false));
      return
    }

    if (error.Code === '101' && error.Message) {
      Alert.alert(error.Message)
      return
    }
  }

  objectToQueryString(obj: any) {
    return Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`,
      )
      .join('&');
  }
  // format tiền việt nam
  getVND = (price: number | string, suffix: string = ' VNĐ') => {
    if (price === null || price === undefined) return '--';

    let newPrice: any = price.toString();

    if (newPrice.includes(',')) {
      newPrice = newPrice.replaceAll(',', '');
    }

    // new format 
    const ceilPrice = Math.ceil(Number(newPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return suffix ? ceilPrice + suffix : ceilPrice;
  };

  getNumber = (num: string | number) => {
    if (num === null || num === undefined) return '--';

    const numericValue = parseFloat(num.toString());

    if (isNaN(numericValue)) return '--';

    const integerPart = Math.floor(numericValue).toString();

    const formattedNumber = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return formattedNumber;
  };

  getVNDate = (
    date: Date | undefined,
    format: string = 'DD/MM/YYYY - HH:mm:ss',
  ) => {
    if (!date) return '--';
    return moment(date).format(format);
  };

  getShortVNDate = (date: string) => {
    if (!date) return '--';
    return moment(date).format('DD-MM-YYYY HH:mm');
  };

  getDay = (date: string) => {
    if (!date) return '--';
    return moment(date).format('DD-MM-YYYY');
  };

  addDomainToImage = (str: string) => {
    if (!str) return '';
    if (str.includes('http')) return str;
    if (!str.includes('http')) {
      return `https:${str}`;
    }

    if (!str.includes('https://img.alicdn.com')) {
      return `https://img.alicdn.com${str}`;
    }
  };

  addToImage = (str: string) => {
    if (!str) return '';
    if (str.includes('http')) return str;
    if (str.includes('file:///')) return str;
    if (!str.includes('http')) {
      return `${appConfigs.API_URL}:${str}`;
    }
  };

  formatCurrency = (value?: any) => {
    if (value.length > 3) {
      const newValue: string = value?.replaceAll(',', '');

      if (newValue.includes('.')) {
        const priceSplit = newValue.split('.');
        const formatBefore = Number(priceSplit[0])
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${formatBefore}.${priceSplit[1].slice(0, 3)}`;
      } else {
        const toStringMoney = Number(newValue)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return toStringMoney;
      }
    } else {
      return value;
    }
  };


  translateRenderProps = async (renderProps: TRenderProps) => {
    const translatedProps: TRenderProps = {};

    await Promise.all(
      Object.keys(renderProps).map(async (key) => {
        const list = renderProps[key];
        translatedProps[key] = await Promise.all(
          list.map(async (item) => {
            try {
              const nameRes = await translateAPI.toVietnamese(item.name);
              const valueRes = await translateAPI.toVietnamese(item.value);
              return {
                ...item,
                transValue: valueRes,
                transName: nameRes,
              };
            } catch (error) {
              // console.log('-----error: ', error);
              return item; // Keep the original item if translation fails
            }
          }),
        );
      }),
    );

    return translatedProps;
  };

  handleNewSku = async (data: TDataRender) => {
    try {
      const sku = data?.skus.sku;
      // const renderProps = data?.renderProps

      if (sku) {
        const createNewSku = sku.map((elm) => {
          const proSplit = elm.properties_name.split(';');
          let newName = '';
          proSplit.forEach((x) => {
            const xSplit = x.split(':');
            const xlen = xSplit.length;
            newName += `${xSplit[xlen - 1]}|`;
          });

          return {
            ...elm,
            name: newName,
          };
        });

        const newSkuTrasnlate = await this.translateArray(createNewSku);
        return newSkuTrasnlate;
      }
    } catch (err) {
      return false;
    }
  };

  translateArray = async (newSku: any) => {
    const translatedNames = await Promise.all(
      newSku.map(async (elm: any) => {
        const res = await translateAPI.toVietnamese(elm.name);
        elm.name = `${elm.name}||${res}`;
        return elm;
      }),
    );

    return translatedNames;
  };

  /* priceTable: [
    {
        "begin": "2",
        "end": "4999",
        "price": "9.5"
    },
    {
        "begin": "5000",
        "end": "4999999",
        "price": "8.5"
    },
    {
        "begin": "5000000",
        "end": "99999",
        "price": "7.5"
    }
  ]*/

  handlePriceRange = (
    priceRange: TPriceRange | undefined,
    type: 'sendToCart' | 'display',
  ) => {


    let result: {
      begin: string;
      end: string;
      price: string;
    }[] = [];

    let priceStep = '';

    if (!priceRange) return ({
      priceStep: '',
      priceTable: ''
    })
    for (let i in priceRange) {
      const nextRange = priceRange[Number(i) + 1];
      if (nextRange) {
        const x = (Number(nextRange[0]) - 1).toString();
        result.push({
          begin: `${priceRange[i][0]}`,
          end: x,
          price: priceRange[i][1],
        });
      } else {
        result.push({
          begin:
            type === 'display'
              ? `>=${priceRange[i][0]}`
              : `${priceRange[i][0]}`,
          end: type === 'display' ? '' : '9999999999',
          price: priceRange[i][1],
        });
      }
    }

    // priceStep: "2-4999:9.5|5000-4999999:8.5|5000000-99999:7.5|"
    if (type === 'sendToCart') {
      for (let i in result) {
        const cur = result[i];
        const toStr = `${cur.begin}-${cur.end}:${cur.price}`;
        priceStep += `${toStr}|`;
      }

      return {
        priceStep: priceStep,
        priceTable: result,
      };
    }

    return result;
  };

  getPriceFromPriceRange = (priceRange: TPriceRange, quantity: number) => {
    for (let i in priceRange) {
      const cur = priceRange[i];
      const nextCur = priceRange[Number(i) + 1];

      if (nextCur) {
        if (quantity >= Number(cur[0]) && quantity <= Number(nextCur[0])) {
          return cur[1];
        }
      } else {
        return cur[1];
      }
    }
  };

  removeDuplicates = (arr: any) => {
    const idSet = new Set(); // Sử dụng Set để theo dõi các id đã xuất hiện
    const uniqueArray: any = [];

    for (const obj of arr) {
      if (!idSet.has(obj.num_iid)) {
        idSet.add(obj.num_iid);
        uniqueArray.push(obj);
      }
    }

    return uniqueArray;
  }

  formatProductData = (data) => {
    let result: any = '';
    const { productMeta, productSKU } = data;

    const Property = () => {
      try {
        return productSKU.selectedSKU
          .map(item => {
            return item.props.title;
          })
          .join('; ');
      } catch (error) { }

      return '';
    };
    const PropertyValue = () => {
      try {
        return productSKU.selectedSKU
          .map(item => {
            return item.props.value;
          })
          .join(';');
      } catch (error) { }

      return '';
    };
    const stock = () => {
      return !!productSKU.stock.match(/\d+/g)[0]
        ? productSKU.stock.match(/\d+/g)[0]
        : 0;
    };
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
    };

    return result;
  }
}

export const _func = new Func();
