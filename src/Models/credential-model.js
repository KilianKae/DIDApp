import {decodeJWT} from 'did-jwt';

export default class CredentialModel {
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
    let claims = [];
    for (let [key, value] of Object.entries(
      decodedJWT.payload.claim.credentialSubject,
    )) {
      if (key != 'id') {
        //TODO Claim Model
        claims.push({key, value});
      }
    }
    return new CredentialModel({
      claims,
      subject: decodedJWT.payload.claim.credentialSubject.id,
      issuer: decodedJWT.iss,
      signature: decodedJWT.signature,
    });
  }
}
