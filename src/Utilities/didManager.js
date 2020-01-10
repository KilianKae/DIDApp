import Web3 from 'web3';
import {Resolver} from 'did-resolver';
import EthrDid from './ethrDid';
import ethr from 'ethr-did-resolver';
import {saveKeystore, getKeystores} from './asyncStorage';

const endPoints = {
  mainnet: 'https://mainnet.infura.io/v3/ab803204cb9b49adb488de9dd5a06ad9',
  testnet: 'https://rinkeby.infura.io/v3/de303f7185894e5a862e7482da6e398d',
};

//TODO
const testPassword = 'DIDFun';

export default class DIDManager {
  constructor(didCallback) {
    if (!!DIDManager.instance) {
      return DIDManager.instance;
    }
    DIDManager.instance = this;
    this.web3 = new Web3(new Web3.providers.HttpProvider(endPoints.testnet));
    const ethrResolver = ethr.getResolver();
    this.resolver = new Resolver(ethrResolver);
    this.ethrDids = [];
    this.importFromStorage(didCallback);
    console.log('[DIDManager] DIDs', this.getDids());
  }

  importFromStorage(callback) {
    getKeystores()
      .then(keystores => {
        for (keystore of keystores) {
          const account = this.web3.eth.accounts.decrypt(
            keystore,
            testPassword,
          );
          this.addEthrAccount(account, false);
        }
        if (callback) {
          callback();
        }
      })
      .catch(error => console.error(error));
  }

  //TODO Change to congruent naming
  newEthrDID() {
    const account = this.web3.eth.accounts.create();
    this.addEthrAccount(account);
  }

  addEthrAccountFromPrivateKey(privateEthrKey) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateEthrKey);
    this.addEthrAccount(account);
  }

  addEthrAccount(account, store = true) {
    console.log('priv', account.privateKey);
    console.log('pub', account.address);
    this.ethrDids.push(
      new EthrDid({
        provider: this.web3.currentProvider,
        address: account.address,
        privateKey: account.privateKey,
      }),
    );
    if (store) {
      saveKeystore(
        this.web3.eth.accounts.encrypt(account.privateKey, testPassword),
      );
    }
  }

  getDids() {
    return this.ethrDids;
  }

  getGasPrice() {
    return this.web3.eth.getGasPrice();
  }

  getEthrDidAddress(pos) {
    return this.resolver.resolve(this.ethrDIDs[pos].did);
  }
}
