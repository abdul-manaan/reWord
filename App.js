import 'react-native-gesture-handler';
import React from 'react';
import {createAppContainer, } from 'react-navigation';
import MainScreen from "./Screens/MainScreen";
import LearnWords from './Screens/LearnWords'
import LearnFlashCard from './Screens/LearnFlashCard'
import LoginView from './Screens/LoginScreen'
import {Dimensions} from 'react-native'
import {createStackNavigator} from 'react-navigation-stack'
import {createDrawerNavigator} from 'react-navigation-drawer'
import SideBar from './Widgets/SideBar'
import SignupView from './Screens/SignupScreen';
import DashBoard from './Screens/DashBoard';
import VocabSets from './Screens/VocabSets';
import PlayVocabSet from './Screens/PlayVocabSet';
// import AuthScreen from './Screens/AuthScreen';
const WIDTH = Dimensions.get('window').width;



const DrawerConfig = {
    initialRouteName: 'MainStack',
    headerMode: 'screen',
    drawerWidth: WIDTH * 0.75,
    contentComponent: ({navigation}) => {
        return (<SideBar navigation={navigation}/>)
    }
};

export const MainStack = createStackNavigator({
    Login: {
        screen: LoginView,
        navigationOptions:{
            headerShown: false,
        }
    },
    Main: {
        screen: MainScreen,
        navigationOptions:{
          headerShown: false,
        }
    },
    Learn: {
      screen: LearnWords,
      navigationOptions: {
        headerShown: false,
      }
    },
    LearnCard:{
        screen: LearnFlashCard,
        navigationOptions:{
            headerShown: false,
        }
    },
    Signup:{
        screen: SignupView,
        navigationOptions: {
            headerShown: false,
        }
    },
    DashBoard: {
        screen: DashBoard,
        navigationOptions: {
            headerShown: false,
        }
    },
    VocabSets :{
        screen: VocabSets,
        navigationOptions: {
            headerShown: false,
        }
    }, PlayVocabSet:{
        screen: PlayVocabSet,
        navigationOptions: {
            headerShown: false,
        }
    }

},{headerMode: 'screen'});


export const Drawer = createDrawerNavigator({
    MainStack: {
        screen: MainStack
    }
}, DrawerConfig);


export const MainNavigator = createStackNavigator({
    Drawer: {
        screen: Drawer,
        navigationOptions: {
            headerShown: false,
            gesturesEnabled: false
        }
    }
}, {headerMode: 'none'});

console.disableYellowBox = true;
const App = createAppContainer(MainNavigator);

export default App;
