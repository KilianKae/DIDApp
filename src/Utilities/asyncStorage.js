import AsyncStorage from '@react-native-community/async-storage';

export const saveKeystore = async keystore => {
  try {
    //TODO error handling
    let keystores = await getKeystores();
    keystores.push(keystore);
    const keystoresString = JSON.stringify(keystores);
    await AsyncStorage.setItem('keystores', keystoresString);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const getKeystores = async () => {
  let keystores = [];
  try {
    let keystoresString = (await AsyncStorage.getItem('keystores')) || '[]';
    keystores = JSON.parse(keystoresString);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return keystores;
};
