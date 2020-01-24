import EthrDID from 'ethr-did';
import {Resolver} from 'did-resolver';
import ethr from 'ethr-did-resolver';
import didJWT, {verifyJWT, decodeJWT, createJWT} from 'did-jwt';

export default class EthrDid extends EthrDID {
  signer;
  jwk;

  constructor(args, jwk) {
    super(args);
    jwk;
    console.log('[EthrDID] privateKey', args.privateKey);
    this.signer = didJWT.SimpleSigner(args.privateKey);
  }

  generateMyIDResponse(encodedRequestToken, encrypt = false) {
    let verifiedRespone = null;

    console.log('[EthrDID] encodedRequestToken:', encodedRequestToken);
    console.log('[EthrDID] decodeJWT:', decodeJWT(encodedRequestToken));
    this.verifyJWT(encodedRequestToken);

    // createJWT {claim: {name: 'Hanis Bansi'}}
    // this.signJWT()
    //   .then(jwt => {
    //     console.log('[EthrDID] jwt:', jwt);
    //     this.verifyJWT(jwt);
    //   })
    //   .catch(error => console.error('[EthrDID] signJWT error:', error));

    // Expiration Date for response token: seconds till now + 1h
    const expiration = Date.now() / 1000 + 3600;
  }

  //TODO try to remove, unistall resolvers
  verifyJWT(jwt, audience = this.did) {
    let verifiedRespone;
    const ethrResolver = ethr.getResolver();
    const resolver = new Resolver(ethrResolver);
    verifyJWT(jwt, {resolver, audience})
      .then(respone => {
        verifiedRespone = respone;
        console.log('[EthrDID] verifiedRespone:', verifiedRespone);
      })
      .catch(error => console.error('[EthrDID] verifyJWT error:', error));
  }

  signJWT() {
    return createJWT(
      {
        //aud: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
        exp: 1957463421,
        name: 'uPort Developer',
      },
      {
        alg: 'ES256K-R',
        issuer: this.did,
        signer: this.signer,
      },
    );
  }

  // generateSiopResponse(encodedRequestToken, encrypt = false) {
  //   //const requestToken = jose.JWT.decode(encodedRequestToken, {complete: true});
  //   const requestToken = this.verifyJWT(this.testToken);
  //   console.log('[EthrDID] requestToken:', requestToken);

  //   // Expiration Date for response token: seconds till now + 1h
  //   const expiration = Date.now() / 1000 + 3600;
  //   const siopResponse = {
  //     nonce: 'n-0S6_WzA2Mj',
  //     exp: expiration,
  //     sub_jwk: {
  //       //TODO Should be
  //       crv: 'secp256k1', //secp256k1
  //       kid: 'did:example:0xcd#verikey-1',
  //       kty: 'EC',
  //       x: '7KEKZa5xJPh7WVqHJyUpb2MgEe3nA8Rk7eUlXsmBl-M',
  //       y: '3zIgl_ml4RhapyEm5J7lvU-4f5jiBvZr4KgxUjEhl9o',
  //     },
  //     sub: this.address, //TO Should be thumbprint
  //     did: this.did,
  //   };

  //   const testRequest = {
  //     exp: expiration,
  //     response_type: 'id_token',
  //     client_id: 'http://localhost:8080',
  //     scope: 'openid did_authn',
  //   };

  //   this.signJWT()
  //     .then(jwt => console.log(jwt))
  //     .catch(error => console.error(error));
  // }
}
