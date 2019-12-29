import Web3 from 'web3';
import {Resolver} from 'did-resolver';
import EthrDID from 'ethr-did';
import ethr from 'ethr-did-resolver';
import {saveKeystore, getKeystore} from './asyncStorage';

const endPoints = {
  mainnet: 'https://mainnet.infura.io/v3/ab803204cb9b49adb488de9dd5a06ad9',
  testnet: 'https://rinkeby.infura.io/v3/de303f7185894e5a862e7482da6e398d',
};

//TODO
const testPassword = 'DIDFun';

export default class DIDManager {
  static instance;

  constructor() {
    if (this.instance) {
      return this.instance;
    }
    this.web3 = new Web3(new Web3.providers.HttpProvider(endPoints.testnet));
    const ethrResolver = ethr.getResolver();
    this.resolver = new Resolver(ethrResolver);
    this.ethrDIDs = [];
    // TODO improve
    getKeystore().then(keystores => {
      console.log('keystores', keystores);
      for (keystore of keystores) {
        this.ethrDIDs.push(
          this.web3.eth.accounts.decrypt(keystore, testPassword),
        );
      }
      this.instance = this;
    });
  }

  addEthrAccount(privateEthrKey) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateEthrKey);
    this.ethrDIDs.push(
      new EthrDID({
        provider: this.web3.currentProvider,
        address: account.address,
        privateKey: privateEthrKey,
      }),
    );
    saveKeystore([
      this.web3.eth.accounts.encrypt(privateEthrKey, testPassword),
    ]);
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
