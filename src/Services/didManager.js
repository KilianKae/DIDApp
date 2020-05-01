import HttpProvider from 'ethjs-provider-http';
import EthrDid from './ethrDid';
import {saveKeystore, getKeystores, deleteKeystore} from './asyncStorage';
import {
  decryptKeystore,
  encryptKeystore,
  isAuthentified,
  subscribe,
} from './authService';

const endPoints = {
  mainnet: 'https://mainnet.infura.io/v3/ab803204cb9b49adb488de9dd5a06ad9',
  testnet: 'https://rinkeby.infura.io/v3/de303f7185894e5a862e7482da6e398d',
};

export default class DIDManager {
  handlers = []; // observers
  ethrDids = [];
  provider;
  didsLoaded = false;

  constructor() {
    if (!!DIDManager.instance) {
      return DIDManager.instance;
    }
    DIDManager.instance = this;
    this.provider = new HttpProvider(endPoints.testnet);
  }

  // Add observer for dids
  subscribe(fn) {
    this.handlers.push(fn);
  }

  // Remove observer for dids
  unsubscribe(fn) {
    this.handlers = this.handlers.filter(function(item) {
      if (item !== fn) {
        return item;
      }
    });
  }

  // Puplish did change
  publish() {
    this.handlers.forEach(fn => fn.call());
  }

  // Import keystores from async storage
  importFromStorage() {
    if (this.didsLoaded) {
      this.publish();
    } else if (isAuthentified()) {
      this.importKeystores();
    } else {
      subscribe(() => this.importKeystores());
    }
  }

  importKeystores() {
    getKeystores()
      .then(keystores => {
        keystores.forEach(keystore => {
          const decryptResult = decryptKeystore(keystore);
          if (decryptResult.success) {
            this.addEthrAccount(decryptResult.account, false);
          } else {
            //TODO
            alert('Incorect Password');
          }
        });
        if (keystores.length === 0) {
          this.publish();
        }
        this.didsLoaded = true;
      })
      .catch(error => console.error(error));
  }

  newEthrDid() {
    console.log('[DidManager] Creating new keypair');
    const keystore = EthrDid.createKeyPair();
    return this.addEthrAccount(keystore, true);
  }

  addEthrAccount(keystore, store) {
    console.log('[DidManager] adding ether account', keystore.address);
    const ethrDid = new EthrDid(keystore);
    if (store) {
      keystore = encryptKeystore(keystore);
      saveKeystore(keystore);
    }
    this.ethrDids.push(ethrDid);
    this.publish();
    return ethrDid;
  }

  deleteEthrAccount(address) {
    this.ethrDids = this.ethrDids.filter(ethrDid => ethrDid.address != address);
    deleteKeystore(address);
    this.publish();
  }

  getDids() {
    return this.ethrDids;
  }
}
