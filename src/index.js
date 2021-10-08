import { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Login } from './screens'
import { Apps } from './screens'

const Router = createStackNavigator(
  {
    Login,
    Apps
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
);

export default createAppContainer(Router);