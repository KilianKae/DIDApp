import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import './Helpers/shim';
import './Helpers/global';
import HomeScreen from './Screens/HomeScreen';

const MainNavigator = createStackNavigator(
  {
    Home: HomeScreen,
  },
  {
    headerMode: 'none',
  },
);

const App = createAppContainer(MainNavigator);

export default App;
