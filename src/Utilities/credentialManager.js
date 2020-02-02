import VerifiableCredential from '../Models/verifiableCredential';
import {saveCredential, getCredentials} from './asyncStorage';

export default class CredentialManager {
  handlers = [];
  credentials = [];
  credentialsLoaded = false;

  constructor() {
    if (!!CredentialManager.instance) {
      return CredentialManager.instance;
    }
    CredentialManager.instance = this;
  }

  // Add observer for credentials
  subscribe(fn) {
    this.handlers.push(fn);
  }

  // Remove observer for credentials
  unsubscribe(fn) {
    this.handlers = this.handlers.filter(function(item) {
      if (item !== fn) {
        return item;
      }
    });
  }

  // Puplish credential change
  publish() {
    this.handlers.forEach(fn => fn.call());
  }

  addCredentialFromJWT(jwt) {
    const credential = VerifiableCredential.fromJWT(jwt);
    saveCredential(credential);
    this.credentials.push(credential);
    this.publish();
  }

  importFromStorage() {
    if (this.credentialsLoaded) {
      this.publish();
    } else {
      getCredentials()
        .then(credentials => {
          this.credentials = credentials;
          this.credentialsLoaded = true;
          this.publish();
        })
        .catch(error => console.error(error));
    }
  }

  getCredentialForDid(did) {
    return this.credentials.filter(crd => crd.subject == did);
  }
}
