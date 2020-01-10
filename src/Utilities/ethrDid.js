import EthrDID from 'ethr-did';
export default class EthrDid extends EthrDID {
  constructor(args) {
    super(args);
  }

  generateSiopResponse(encodedRequestToken, encrypt = false) {
    //const requestToken = jose.JWT.decode(encodedRequestToken, {complete: true});

    // Expiration Date for response token: seconds till now + 1h
    const expiration = Date.now() / 1000 + 3600;
    this.signJWT({
      nonce: 'n-0S6_WzA2Mj',
      exp: expiration,
      sub_jwk: {
        //TODO Should be
        crv: 'secp256k1', //secp256k1
        kid: 'did:example:0xcd#verikey-1',
        kty: 'EC',
        x: '7KEKZa5xJPh7WVqHJyUpb2MgEe3nA8Rk7eUlXsmBl-M',
        y: '3zIgl_ml4RhapyEm5J7lvU-4f5jiBvZr4KgxUjEhl9o',
      },
      sub: this.address, //TO Should be thumbprint
      did: this.did,
    })
      .then(jwt => console.log(jwt))
      .catch(error => console.error(error));
  }
}
