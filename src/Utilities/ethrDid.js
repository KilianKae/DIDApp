import EthrDID from 'ethr-did';
import {Resolver} from 'did-resolver';
import ethr from 'ethr-did-resolver';
import didJWT, {verifyJWT, decodeJWT, createJWT} from 'did-jwt';
import {generatePublicKey} from './generate-keys';

export default class EthrDid extends EthrDID {
  signer;
  jwk;

  constructor(args, jwk) {
    console.log('[EthrDID] New EtherDID');
    super(args);
    this.jwk = jwk;
    this.signer = didJWT.SimpleSigner(args.privateKey);
  }

  generateSiopResponse(encodedRequestToken, encrypt = false) {
    let nonce;
    this.verifyJWT(encodedRequestToken)
      .then(verifiedRequestToken => {
        console.log('[EthrDID] verifiedRequestToken:', verifiedRequestToken);
        const kid = '#key-1';
        nonce = verifiedRequestToken.payload.nonce;
        return generatePublicKey(kid, this.jwk);
      })
      .then(publicKey => {
        const kid = `${this.did}#key-1`;
        const sub_jwk = {
          crv: publicKey.crv,
          kid: kid,
          kty: publicKey.kty,
          x: publicKey.x,
          y: publicKey.y,
        };
        // Expiration Date for response token: seconds till now + 1h
        const expiration = Date.now() / 1000 + 3600;
        const siopResponse = {
          iss: 'https://self-issued.me',
          nonce, //TODO
          exp: expiration,
          sub_jwk,
          did: this.did,
        };
        return this.signJWT(siopResponse);
      })
      .then(jwt => console.log('[EthrDID] siopResponse', jwt))
      .catch(error => console.error(error));
  }

  //TODO try to remove, unistall resolvers
  async verifyJWT(jwt, audience = this.did) {
    const ethrResolver = ethr.getResolver();
    const resolver = new Resolver(ethrResolver);
    const verifiedJWT = await verifyJWT(jwt, {resolver, audience});
    return verifiedJWT;
  }

  signJWT(jwt) {
    return createJWT(jwt, {
      alg: 'ES256K-R',
      issuer: this.did,
      signer: this.signer,
    });
  }
}
