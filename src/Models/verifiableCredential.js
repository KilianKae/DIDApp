import {decodeJWT} from 'did-jwt';

export default class VerifiableCredential {
  claims;
  subject;
  signature;
  issuer;

  constructor({claims, subject, issuer, signature}) {
    this.claims = claims;
    this.subject = subject;
    this.signature = signature;
    this.issuer = issuer;
  }

  static fromJWT(jwt) {
    //TODO do checks
    const decodedJWT = decodeJWT(jwt);
    console.log('decodedJWT', decodedJWT);
    let claims = [];
    for (let [key, value] of Object.entries(
      decodedJWT.payload.claim.credentialSubject,
    )) {
      if (key != 'id') {
        //TODO Claim Model
        claims.push({key, value});
      }
    }
    return new VerifiableCredential({
      claims,
      subject: decodedJWT.payload.claim.credentialSubject.id,
      issuer: decodedJWT.payload.iss,
      signature: decodedJWT.signature,
    });
  }

  compare(credential) {
    return (
      credential.issuer == this.issuer &&
      credential.subject == this.subject &&
      //TODO more sophisticated sort
      credential.claims[0].value == this.claims[0].value
    );
  }
}
