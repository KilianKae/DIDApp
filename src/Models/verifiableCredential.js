/*eslint eqeqeq: ["error", "smart"]*/
import {decodeJWT} from 'did-jwt';
import DIDManager from '../Services/didManager';

const didManager = new DIDManager();
export default class VerifiableCredential {
  type;
  claims;
  subject;
  signature;
  issuer;
  iat;

  constructor({type, claims, subject, issuer, signature, iat}) {
    this.type = type;
    this.claims = claims;
    this.subject = subject;
    this.signature = signature;
    this.issuer = issuer;
    this.iat = iat;
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
      iat: payload.iat,
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

  //TODO this could be improved
  createVerifiablePresentation(challenge) {
    const subject = didManager.getEthrDid(this.subject);
    let credentialSubject = {
      id: this.subject,
    };
    this.claims.forEach(claim => (credentialSubject[claim.key] = claim.value));
    const credential = {
      type: ['VerifiablePresentation'],
      challenge,
      verfiableCredential: {
        type: ['VerifiableCredential', 'CourseCredential'],
        credentialSubject,
        iss: this.issuer,
        iat: this.iat,
        signature: this.signature,
      },
    };
    return subject.signJWT(credential);
  }
}
