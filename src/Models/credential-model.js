import {decodeJWT} from 'did-jwt';

export default class CredentialModel {
  id;
  claims;
  subject;
  signature;
  issuer;

  constructor({claims, subject, issuer, signature}) {
    this.id = (Date.now() + Math.floor(Math.random() * 100)).toString(16);
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
    return new CredentialModel({
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

  toJSON() {
    return {
      claims: this.claims,
      subject: this.subject,
      issuer: this.issuer,
      signature: this.signature,
    };
  }
}
