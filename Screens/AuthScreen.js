import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';


export default class AuthScreen extends React.Component {
    
    
    
    App = () => {
        const [user, setUser] = useState();
        const [initializing, setInitializing] = useState(true);
        // Set an initializing state whilst Firebase connects
        // Handle user state changes
        function onAuthStateChanged(user) {
            setUser(user);
          if (initializing) setInitializing(false);
        }
        useEffect(() => {
            const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            return subscriber; // unsubscribe on unmount
        }, []);
        
        if (initializing) return null;
        if (!user) {
            this.props.navigation.navigate('Login')
        }
        
        else {
            this.props.navigation.navigate('Home')
        }
    }

    render(){
        {this.App()}
    }
}

