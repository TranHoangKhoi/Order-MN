import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken } from '~/api/instance';
import { TUser } from '~/types';

const TOKEN = 'ACCESS_TOKEN';
const USER = 'USER';

export const LocalStorage = {
  async setIsFake(value: boolean) {
    try {
      await AsyncStorage.setItem('isFake', JSON.stringify(value));
    } catch (error) {
      // console.log(error);
    }
  },
  async getFake() {
    const response = await AsyncStorage.getItem('isFake');
    return response == null ? null : JSON.parse(response);
  },

  async setUser(params: TUser) {
    try {
      let temp = JSON.stringify(params);
      await AsyncStorage.setItem(USER, temp);
    } catch (error) {
      // console.log(error);
    }
  },
  async getUser() {
    const response = await AsyncStorage.getItem(USER);
    return response == null ? null : JSON.parse(response);
  },

  async saveToken(token: string) {
    try {
      await AsyncStorage.setItem(TOKEN, token);
      setToken(token);
    } catch (error) {
      // console.log(error);
    }
  },
  async getToken() {
    const response: string | null = await AsyncStorage.getItem(TOKEN)
    return response == null ? null : response
  },

  async logout() {
    await AsyncStorage.multiRemove([USER, TOKEN]);
  },

  async deleteToken() {
    await AsyncStorage.removeItem(TOKEN);
  },
};
