import {openURL} from '../Services/browserLinking';
let handeltRequestToken;

export function handelSIOPRequest(ethrDid, requestToken, client_id, callback) {
  if (handeltRequestToken === requestToken) {
    console.log('[SIOP Service] This token was allredy handeled');
  } else {
    handeltRequestToken = requestToken;
    console.log('[SIOP Service] Generating SIOP Response');
    ethrDid
      .generateSiopResponse(requestToken)
      .then(id_token => {
        console.log('[SIOP Service] Generated SIOP response token', id_token);
        openURL(client_id, {
          id_token,
        });
        callback();
      })
      .catch(err => console.error('[SIOP Service] An error occurred', err));
  }
}

export function tokenHandelt(requestToken) {
  return handeltRequestToken === requestToken;
}
