import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './HomeScreen';

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
