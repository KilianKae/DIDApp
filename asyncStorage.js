import AsyncStorage from '@react-native-community/async-storage';

export const saveKeystore = async keystore => {
  try {
    const keystoreString = JSON.stringify(keystore);
    await AsyncStorage.setItem('keystore', keystoreString);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const getKeystore = async () => {
  let keystoreString = '';
  try {
    keystoreString = (await AsyncStorage.getItem('keystore')) || '{}';
    keystore = JSON.parse(keystoreString);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return keystore;
};
