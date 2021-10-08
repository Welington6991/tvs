/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Platform, View } from 'react-native';
import Src from './src';
import Orientation from 'react-native-orientation';

const App = () => {
  if (Platform.isTV) {
    Orientation.lockToLandscape();
  } else {
    Orientation.lockToPortrait();
  }
  return (
    <View style={{ flex: 1 }}>
      <Src />
    </View>
  );
};

export default App;