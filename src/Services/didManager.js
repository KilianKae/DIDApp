import HttpProvider from 'ethjs-provider-http';
import EthrDid from './ethrDid';
import {saveKeystore, getKeystores, deleteKeystore} from './asyncStorage';

const endPoints = {
  mainnet: 'https://mainnet.infura.io/v3/ab803204cb9b49adb488de9dd5a06ad9',
  testnet: 'https://rinkeby.infura.io/v3/de303f7185894e5a862e7482da6e398d',
};

//TODO Add PW encryption

export default class DIDManager {
  handlers = []; // observers
  ethrDids = [];
  provider = undefined;
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

  importFromStorage() {
    if (this.didsLoaded) {
      this.publish();
    } else {
      getKeystores()
        .then(keystores => {
          for (keystore of keystores) {
            this.addEthrAccount(keystore, false);
          }
          this.didsLoaded = true;
        })
        .catch(error => console.error(error));
    }
  }

  newEthrDid() {
    console.log('[DidManager] Creating new keypair');
    const account = EthrDid.createKeyPair();
    this.addEthrAccount(account, true);
  }

  addEthrAccount(account, store) {
    console.log('[DidManager] account', account);
    if (store) {
      saveKeystore(account);
    }
    let ethrDid = new EthrDid(account);
    this.ethrDids.push(ethrDid);
    this.publish();
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
