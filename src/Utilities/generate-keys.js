import {EcPrivateKey} from '@decentralized-identity/did-auth-jose';

export const generatePrivateKey = async () => {
  const kid = '#key-1';
  const privKey = await EcPrivateKey.generatePrivateKey(kid);
  return privKey;
};

//TODO generate private key directly?
export const generatePublicKey = async (kid, jwk) => {
  const privKey = await EcPrivateKey.wrapJwk(kid, jwk);
  return privKey.getPublicKey();
};
