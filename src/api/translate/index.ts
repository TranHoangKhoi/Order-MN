export const translateAPI = {
  toChinese: async (value: string) => {
    return new Promise<string>((resolve, reject) => {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=zh-CN&dt=t&q=${value}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // console.log('translateAPI.toChinese: ', data[0][0][0].toString());
          resolve(data[0][0][0].toString());
        })
        .catch((error) => reject(false));
    });
  },

  toVietnamese: async (value: string) => {
    return new Promise<string>((resolve, reject) => {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=vi&dt=t&q=${value}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // console.log('translateAPI.toVietnamese: ', data[0][0][0].toString());
          resolve(data[0][0][0].toString());
        })
        .catch((error) => reject(false));
    });
  },
};
