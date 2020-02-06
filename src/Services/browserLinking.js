import {Linking} from 'react-native';
import url from 'url';

export const openURL = (pathname, query) => {
  const targetUrl = url.format({
    pathname,
    query,
  });
  console.log('[BrwoserLinking] Return url' + targetUrl);
  Linking.canOpenURL(targetUrl)
    .then(supported => {
      if (!supported) {
        console.log('[BrwoserLinking] Url is unsported' + targetUrl);
      } else {
        Linking.openURL(targetUrl);
      }
    })
    .catch(err => console.error('[BrwoserLinking] An error occurred', err));
};
