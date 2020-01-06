import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import './Helpers/shim';
import './Helpers/global';
import HomeScreen from './Screens/HomeScreen';
import CredentialsScreen from './Screens/CredentialsScreen';
import DidScreen from './Screens/DidScreen';

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
      path: 'login',
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
  },
);

const App = createAppContainer(MainNavigator);

export default App;
