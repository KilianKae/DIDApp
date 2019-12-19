import Web3 from 'web3';
import {Resolver} from 'did-resolver';
import EthrDID from 'ethr-did';
import ethr from 'ethr-did-resolver';

const endPoints = {
  mainnet: 'https://mainnet.infura.io/v3/ab803204cb9b49adb488de9dd5a06ad9',
  testnet: 'https://rinkeby.infura.io/v3/de303f7185894e5a862e7482da6e398d',
};

console.log('Test');
console.log(Resolver);
const web3 = new Web3(new Web3.providers.HttpProvider(endPoints.testnet));
const ethrResolver = ethr.getResolver();
const resolver = new Resolver(ethrResolver);

web3.eth.getGasPrice().then(price => console.log(price));
const account = web3.eth.accounts.privateKeyToAccount(
  '055625aecdde464cbbe6ef3ee5806ed74eafe57a01523e6a01a6d09b1c626495',
);
console.log('Test');
resolver.resolve('did:ethr:' + account.address).then(doc => console.log(doc));

ethrDid = new EthrDID({
  provider: web3.currentProvider,
  address: account.address,
});
