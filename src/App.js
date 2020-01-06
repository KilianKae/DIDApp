import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import './Helpers/shim';
import './Helpers/global';
import HomeScreen from './Screens/HomeScreen';
import CredentialsScreen from './Screens/CredentialsScreen';
import DidScreen from './Screens/DidScreen';

// console.log('[App] Seting up deep linking...');
// Linking.addEventListener('url', this._handleUrl);
// DeepLinking.addScheme('didapp://');
// DeepLinking.addRoute('/login/returnUrl/:returnUrl', response => {
//   Linking.openURL(decodeURIComponent(response.returnUrl));
//   console.log('[App] Received response: ', response);
// });

// // Linking.removeEventListener('url', this._handleUrl);
// // DeepLinking.resetSchemes();
// // DeepLinking.resetRoutes();

// _handleUrl = ({url}) => {
//   console.log('[App] Handling url: ', url);
//   Linking.canOpenURL(url).then(supported => {
//     if (supported) {
//       DeepLinking.evaluateUrl(url);
//     }
//   });
// };
//

const MainNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      path: '',
    },
    Credentials: {
      screen: CredentialsScreen,
      path: 'credentials',
    },
    Dids: {
      screen: DidScreen,
      path: 'login/:returnUrl',
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
  },
);

const App = createAppContainer(MainNavigator);

export default App;
