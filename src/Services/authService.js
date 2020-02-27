import CryptoJS from 'crypto-js';
import {getPassword, savePassword} from './asyncStorage';

let password;
let observers = [];

// Add observer for password
export const subscribe = fn => {
  observers.push(fn);
};

// Remove observer for password
export const unsubscribe = fn => {
  observers = observers.filter(function(item) {
    if (item !== fn) {
      return item;
    }
  });
};

// Puplish password change
const publish = () => {
  observers.forEach(fn => fn.call());
  observers = [];
};

export const isAuthentified = () => {
  return Boolean(password);
};

export const isPasswordSet = () => {
  return getPassword()
    .then(pw => {
      return !(pw === '');
    })
    .catch(error => console.error(error));
};

export const setPassword = key => {
  password = key;
  publish();
  savePassword(key);
};

export const login = key => {
  return isPwValid(key)
    .then(isValid => {
      if (isValid) {
        password = key;
        publish();
        return true;
      } else {
        return false;
      }
    })
    .catch(error => console.error(error));
};

//TODO super ugly
const isPwValid = key => {
  return getPassword()
    .then(pw => {
      return pw === key;
    })
    .catch(error => console.error(error));
};

export const encryptKeystore = account => {
  const encrypted = CryptoJS.AES.encrypt(
    account.privateKey,
    password,
  ).toString();
  const hmac = CryptoJS.HmacSHA256(
    encrypted,
    CryptoJS.SHA256(password),
  ).toString();
  account.privateKey = hmac + encrypted;
  return account;
};

export const decryptKeystore = account => {
  const hmac = account.privateKey.substring(0, 64);
  const encrypted = account.privateKey.substring(64);
  if (!isValidHmac(encrypted, hmac, password)) {
    return {success: false, account: null};
  }
  const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(
    CryptoJS.enc.Utf8,
  );
  account.privateKey = decrypted;
  return {success: true, account: account};
};

function isValidHmac(encrypted, hmac) {
  const decryptedhmac = CryptoJS.HmacSHA256(
    encrypted,
    CryptoJS.SHA256(password),
  ).toString();
  return hmac == decryptedhmac;
}
