// utils/asyncStorageHelper.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDataFromAsyncStorage = async (key: string): Promise<any> => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    // If data is null or doesn't exist, return an empty array or object
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error getting data from AsyncStorage', error);
    return [];  // Return empty array in case of error
  }
};

export const saveDataToAsyncStorage = async (key: string, data: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to AsyncStorage', error);
  }
};
