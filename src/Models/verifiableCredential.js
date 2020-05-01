/*eslint eqeqeq: ["error", "smart"]*/
import {decodeJWT} from 'did-jwt';

export default class VerifiableCredential {
  type;
  claims;
  subject;
  signature;
  issuer;

  constructor({type, claims, subject, issuer, signature}) {
    this.type = type;
    this.claims = claims;
    this.subject = subject;
    this.signature = signature;
    this.issuer = issuer;
  }

  static fromJWT(jwt) {
    //TODO do checks
    const decodedJWT = decodeJWT(jwt);
    const payload = decodedJWT.payload;
    console.log('[VC] payload: ', payload);
    let claims = [];
    for (let [key, value] of Object.entries(payload.credentialSubject)) {
      if (key !== 'id') {
        //TODO Claim Model
        claims.push({key, value});
      }
    }
    return new VerifiableCredential({
      type: payload.type,
      claims,
      subject: payload.credentialSubject.id,
      issuer: payload.iss,
      signature: decodedJWT.signature,
    });
  }

  compare(credential) {
    return (
      credential.issuer === this.issuer &&
      credential.subject === this.subject &&
      //TODO more sophisticated sort
      credential.claims[0].value === this.claims[0].value
    );
  }
}
