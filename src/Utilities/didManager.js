import Web3 from 'web3';
import HttpProvider from 'ethjs-provider-http';
import EthrDid from './ethrDid';
import {saveKeystore, getKeystores} from './asyncStorage';
import {generatePrivateKey} from './generate-keys';
import {jwkToDidPair} from './jwk-to-did';

const endPoints = {
  mainnet: 'https://mainnet.infura.io/v3/ab803204cb9b49adb488de9dd5a06ad9',
  testnet: 'https://rinkeby.infura.io/v3/de303f7185894e5a862e7482da6e398d',
};

//TODO
const testPassword = 'DIDFun';

export default class DIDManager {
  handlers = []; // observers
  web3;
  ethrDids = [];

  constructor() {
    if (!!DIDManager.instance) {
      return DIDManager.instance;
    }
    DIDManager.instance = this;
    Web3.providers.HttpProvider.prototype.sendAsync =
      Web3.providers.HttpProvider.prototype.send;
    this.web3 = new Web3(new Web3.providers.HttpProvider(endPoints.testnet));
    this.provider = new HttpProvider(endPoints.testnet);
    //TODO improve
    this.didsLoaded = false;
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
            this.addEthrAccountFromJwk(keystore, false);
          }
          this.didsLoaded = true;
          console.log(
            '[DIDManager] Loaded DIDs',
            this.getDids().map(ethrDid => ethrDid.did),
          );
        })
        .catch(error => console.error(error));
    }
  }

  newEthrDid() {
    console.log('[DidManager] Creating new keypair');
    generatePrivateKey()
      .then(jwk => {
        this.addEthrAccountFromJwk(jwk);
      })
      .catch(error => {
        console.log('[DidManager] error', error);
      });
  }

  addEthrAccountFromPrivateKey(privateEthrKey) {
    //TODO remove web3
    const account = this.web3.eth.accounts.privateKeyToAccount(privateEthrKey);
    this.addEthrAccount(account);
  }

  addEthrAccountFromJwk(jwk, store = true) {
    if (store) {
      saveKeystore(jwk);
    }
    const {address, privateKey} = jwkToDidPair(jwk);
    const account = {address, privateKey};
    console.log('[DidManager] account from jwk', account);
    this.addEthrAccount(account, jwk);
  }

  addEthrAccount(account, jwk) {
    let ethrDid = new EthrDid(
      {
        provider: this.provider,
        address: account.address,
        privateKey: account.privateKey,
      },
      jwk,
    );
    this.ethrDids.push(ethrDid);
    this.publish();
  }

  getDids() {
    return this.ethrDids;
  }
}
