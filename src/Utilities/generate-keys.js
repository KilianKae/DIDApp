var didAuth = require('@decentralized-identity/did-auth-jose');

export const generatePrivateKey = async () => {
  const kid = '#key-1';
  const privKey = await didAuth.EcPrivateKey.generatePrivateKey(kid);
  return privKey;
};
