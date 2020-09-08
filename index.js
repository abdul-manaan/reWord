/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import database from '@react-native-firebase/database';
database()
  .setPersistenceEnabled(true)
//   .then(() => console.log('Realtime Database persistence enabled'));


AppRegistry.registerComponent(appName, () => App);
