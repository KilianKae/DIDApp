import Web3 from 'web3';
import {Resolver} from 'did-resolver';
import EthrDID from 'ethr-did';
import ethr from 'ethr-did-resolver';

const endPoints = {
  mainnet: 'https://mainnet.infura.io/v3/ab803204cb9b49adb488de9dd5a06ad9',
  testnet: 'https://rinkeby.infura.io/v3/de303f7185894e5a862e7482da6e398d',
};

export default class DIDManager {
  constructor(privateEthrKey) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(endPoints.testnet));
    const ethrResolver = ethr.getResolver();
    this.resolver = new Resolver(ethrResolver);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateEthrKey);
    this.ethrDid = new EthrDID({
      provider: this.web3.currentProvider,
      address: this.account.address,
    });
  }

  getGasPrice() {
    return this.web3.eth.getGasPrice();
  }

  getEthrDidAddress() {
    return this.resolver.resolve('did:ethr:' + this.account.address);
  }
}
