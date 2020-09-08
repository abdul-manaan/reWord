import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  ListView,
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements'
import ImagePicker from 'react-native-image-picker'
import {DoSignUp, Xyz, uploadFileToFireBase, UploadToDB} from '../data/data';
import { ActivityIndicator } from 'react-native-paper';
import storage ,{firebase} from '@react-native-firebase/storage'

export default class SignupView extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      waiting : false,
      name    : '',
      email   : '',
      password: '',
      photo   : '',
      waitingForPicture: "false",
    }
  }

  onClickListener = (viewId) => {
    if (viewId === "login"){
      this.props.navigation.navigate("Login")
    } else if(viewId == "register" && this.state.waitingForPicture === "done"){
      this.setState({waiting:true})
      DoSignUp(this.state.email, this.state.password).then((resp)=> {
        if(resp[0] == false){
          Alert.alert(resp[1]);
          this.setState({waiting:false});
        } else {
          UploadToDB(this.state, resp[2].uid)
          Alert.alert(resp[1]);
          this.props.navigation.navigate('Login');
        }
      })  
    } 
    
    else {
      Alert.alert("Alert", "Button pressed "+viewId);
    }
  }

  handleChoosePhoto = () => {
    this.setState({waitingForPicture: "true"});
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response.fileName })
        uploadFileToFireBase(response).then(() => {
            let imageRef = firebase.storage().ref('/' + this.state.photo );
            imageRef
              .getDownloadURL()
              .then((url) => {
                //from url you can fetched the uploaded image easily
                console.log(url)
                this.setState({profileImageUrl: url, waitingForPicture:"done"});
                
              })
              .catch((e) => console.log('getting downloadURL of image error => ', e,response));
        })
      }
    })
  }

  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imgView}>
            <Image style={styles.img} source={require('../assets/logo.jpg')}/>
        </View>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name="person"/>
          <TextInput style={styles.inputs}
              placeholder="Name"
              keyboardType="text"
              underlineColorAndroid='transparent'
              onChangeText={(name) => this.setState({name})}/>
        </View>
        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} name="email"/>
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>

        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} name="lock"/>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.handleChoosePhoto}>
        {(this.state.waitingForPicture === "true") ?   
              <ActivityIndicator animating={true} color='white' />
              :                    
        (this.state.waitingForPicture!=="done") ? 
              <Text style={styles.loginText}>Choose Profile Photo</Text>
              :
              <Text style={styles.loginText}>Uploaded</Text>    
        }
        </TouchableHighlight>
            
        {/* </View> */}
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('register')}>
        {(this.state.waiting === true) ?   <ActivityIndicator animating={true} color='white' />:
          <Text style={styles.loginText}>Register</Text>}
        </TouchableHighlight>
        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('login')}>
            <Text>Already have an account? Login</Text>
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
  profileButton:{
    height:45,
  }
});