import Web3 from 'web3';
import {Resolver} from 'did-resolver';
import EthrDID from 'ethr-did';
import ethr from 'ethr-did-resolver';
import {saveKeystore, getKeystores} from './asyncStorage';

const endPoints = {
  mainnet: 'https://mainnet.infura.io/v3/ab803204cb9b49adb488de9dd5a06ad9',
  testnet: 'https://rinkeby.infura.io/v3/de303f7185894e5a862e7482da6e398d',
};

//TODO
const testPassword = 'DIDFun';

export default class DIDManager {
  constructor() {
    if (!!DIDManager.instance) {
      return DIDManager.instance;
    }
    DIDManager.instance = this;
    this.web3 = new Web3(new Web3.providers.HttpProvider(endPoints.testnet));
    const ethrResolver = ethr.getResolver();
    this.resolver = new Resolver(ethrResolver);
    this.ethrDIDs = [];
    // TODO improve
    getKeystores().then(keystores => {
      console.log('[DIDManager] keystores', keystores);
      for (keystore of keystores) {
        let account = this.web3.eth.accounts.decrypt(keystore, testPassword);
        this.ethrDIDs.push(
          new EthrDID({
            provider: this.web3.currentProvider,
            address: account.address,
            privateKey: account.privateKey,
          }),
        );
      }
      console.log('[DIDManager] DIDs', this.getDIDs());
    });
    this.instance = this;
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

  addEthrAccount(account) {
    this.ethrDIDs.push(
      new EthrDID({
        provider: this.web3.currentProvider,
        address: account.address,
        privateKey: account.privateKey,
      }),
    );
    saveKeystore(
      this.web3.eth.accounts.encrypt(account.privateKey, testPassword),
    );
  }

  getDIDs() {
    return this.ethrDIDs.map(ethrDID => ethrDID.did);
  }

  getGasPrice() {
    return this.web3.eth.getGasPrice();
  }

  getEthrDidAddress(pos) {
    return this.resolver.resolve(this.ethrDIDs[pos].did);
  }
}
