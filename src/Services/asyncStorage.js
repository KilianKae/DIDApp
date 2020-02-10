import AsyncStorage from '@react-native-community/async-storage';
import VerifiableCredential from '../Models/verifiableCredential';

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

export const deleteKeystore = async did => {
  try {
    let keystores = await getKeystores();
    keystores = keystores.filter(keystore => keystore.address != did);
    const keystoresString = JSON.stringify(keystores);
    await AsyncStorage.setItem('keystores', keystoresString);
  } catch (error) {
    console.error(error.message);
  }
};

export const saveCredential = async credential => {
  try {
    let credentials = await getCredentials();
    credentials.push(credential);
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
    credentials = JSON.parse(credentialsString).map(
      credential => new VerifiableCredential(credential),
    );
  } catch (error) {
    console.error(error.message);
  }
  return credentials;
};

export const deleteCredential = async signature => {
  try {
    let credentials = await getCredentials();
    credentials = credentials.filter(
      credential => credential.signature != signature,
    );
    const credentialsString = JSON.stringify(credentials);
    await AsyncStorage.setItem('credentials', credentialsString);
  } catch (error) {
    console.error(error.message);
  }
};
