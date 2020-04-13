import EthrDID from 'ethr-did';
import {Resolver} from 'did-resolver';
import ethr from 'ethr-did-resolver';
import didJWT, {verifyJWT} from 'did-jwt';
import {toEthereumAddress} from 'did-jwt/lib/index';
const EC = require('elliptic').ec;
const secp256k1 = new EC('secp256k1');

export default class EthrDid extends EthrDID {
  signer;
  jwk;
  associatedServices = [];

  constructor({provider, address, privateKey, jwk}) {
    console.log('[EthrDID] New EtherDID');
    super({provider, address, privateKey});
    this.jwk = jwk;
    this.signer = didJWT.SimpleSigner(privateKey);
  }

  static createKeyPair() {
    const kp = secp256k1.genKeyPair();
    const x = kp
      .getPublic()
      .getX()
      .toJSON();
    const y = kp
      .getPublic()
      .getY()
      .toJSON();
    const publicKey = kp.getPublic('hex');
    const privateKey = kp.getPrivate('hex');
    const address = toEthereumAddress(publicKey);
    const kid = `${address}#verikey-1`;
    const crv = 'secp256k1';
    const kty = 'EC';
    const jwk = {crv, x, y, kty, kid};
    return {address, privateKey, jwk};
  }

  async generateSiopResponse(encodedRequestToken, encrypt = false) {
    let nonce;
    const siopResonse = await this.verifyJWT(encodedRequestToken).then(
      verifiedRequestToken => {
        console.log('[EthrDID] verifiedRequestToken:', verifiedRequestToken);
        this.addAssociatedService(
          verifiedRequestToken.payload.payload.client_id,
        );
        nonce = verifiedRequestToken.payload.nonce;
        // Expiration Date for response token: seconds till now + 1h
        const expiration = Date.now() / 1000 + 3600;
        const response = {
          iss: 'https://self-issued.me',
          nonce,
          exp: expiration,
          sub_jwk: this.jwk,
          did: this.did,
        };
        return this.signJWT(response);
      },
    );
    return siopResonse;
  }

  //TODO try to remove, unistall resolvers
  async verifyJWT(jwt, audience = this.did) {
    const ethrResolver = ethr.getResolver();
    const resolver = new Resolver(ethrResolver);
    const verifiedJWT = await verifyJWT(jwt, {
      resolver,
      audience,
    });
    return verifiedJWT;
  }

  addAssociatedService(serviceURL) {
    if (
      serviceURL === 'http://localhost:8080/institution/a/auth/siopResponse' &&
      !this.associatedServices.includes('Institution A')
    ) {
      this.associatedServices.push('Institution A');
    }
    if (
      serviceURL === 'http://localhost:8080/institution/b/auth/siopResponse' &&
      !this.associatedServices.includes('Institution B')
    ) {
      this.associatedServices.push('Institution B');
    }
  }
}
