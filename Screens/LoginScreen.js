import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import {DoSignIn, GetUserData} from '../data/data'
import { ActivityIndicator } from 'react-native-paper';
import auth, { firebase } from "@react-native-firebase/auth";

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      waiting : false,
      email   : '',
      password: '',
    }
  }
  componentDidMount = () => {
    //  this.register("said1292@gmail.com", "123456");
    
    let resp = this.__isTheUserAuthenticated();
    if (resp) {
      console.log("fired")
      this.props.navigation.navigate('Main')
    }
  }

  __isTheUserAuthenticated = () => {
    let user = firebase.auth().currentUser;
    if (user) {
      GetUserData(user.uid)
      return true;
    } else {
      return false;
    }
  };

  onClickListener = (viewId) => {
    if (viewId === "register"){
      this.props.navigation.navigate('Signup')
    }
    else if (viewId === "login"){
      this.setState({waiting:true})
      DoSignIn(this.state.email, this.state.password).then( (resp) => {
        if (resp[0] == true){
          this.props.navigation.navigate("Main")
        } else {
          Alert.alert(resp[1])
          this.setState({waiting:false})
        }
      })
    }
    else {
      Alert.alert("Alert", "Button pressed "+viewId);

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imgView}>
            <Image style={styles.img} source={require('../assets/logo.jpg')}/>
        </View>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
            
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
        {(this.state.waiting === true) ?   <ActivityIndicator animating={true} color='white' />:
          <Text style={styles.loginText}>Login</Text>}
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
            <Text>Forgot your password?</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
            <Text>Register</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  img: {
    height: 250,
    width: 250,
    borderRadius: 125,
    marginBottom:20,    
  },
});