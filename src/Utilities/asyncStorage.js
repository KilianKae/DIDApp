import AsyncStorage from '@react-native-community/async-storage';
import Credential from '../Models/credential-model';

//TODO async keystore - async ()?
export const saveKeystore = async keystore => {
  try {
    let keystores = await getKeystores();
    keystores.push(keystore);
    const keystoresString = JSON.stringify(keystores);
    await AsyncStorage.setItem('keystores', keystoresString);
  } catch (error) {
    console.error(error.message);
  }
};

export const getKeystores = async () => {
  let keystores = [];
  try {
    let keystoresString = (await AsyncStorage.getItem('keystores')) || '[]';
    keystores = JSON.parse(keystoresString);
  } catch (error) {
    console.error(error.message);
  }
  return keystores;
};

export const saveCredential = async credential => {
  try {
    let credentials = await getCredentials();
    credentials.push(credential.toJSON());
    const credentialsString = JSON.stringify(credentials);
    await AsyncStorage.setItem('credentials', credentialsString);
  } catch (error) {
    console.error(error.message);
  }
};

export const getCredentials = async () => {
  let credentials = [];
  try {
    let credentialsString = (await AsyncStorage.getItem('credentials')) || '[]';
    console.log('sdsadaffas', credentialsString);
    credentials = JSON.parse(credentialsString);
    credentials.map(crd => new Credential(crd));
  } catch (error) {
    console.error(error.message);
  }
  return credentials;
};
