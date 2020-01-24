import {toEthereumAddress} from 'did-jwt/lib/index';

export const jwkToDidPair = jwkPriv => {
  //(base64url)key.d -> Buffer -> (hex)privateKey
  const privateKey = base64urlToBuffer(jwkPriv.d).toString('hex');

  //key.x + key.y -> publicKey -> toEthereumAddress
  const x = Buffer.from(jwkPriv.x);
  const y = Buffer.from(jwkPriv.y);
  const publicKey = Buffer.concat([x, y]);
  const address = toEthereumAddress(publicKey);

  const didPair = {
    address,
    privateKey,
  };

  return didPair;
};

function base64urlToBuffer(string) {
  return Buffer.from(base64urlToBase64(string), 'base64');
}

function base64urlToBase64(input) {
  // Replace non-url compatible chars with base64 standard chars
  input = input.replace(/-/g, '+').replace(/_/g, '/');

  // Pad out with standard base64 required padding characters (=)
  var pad = input.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error(
        'InvalidLengthError: Input base64url string is the wrong length to determine padding',
      );
    }
    input += new Array(5 - pad).join('=');
  }

  return input;
}
