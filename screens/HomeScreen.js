import React from 'react';
import {
  View, StyleSheet,Text,Alert,AsyncStorage
} from 'react-native';
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('todos');
    this.state={
      lyfestyles:[],
      userData:""
    }
  googleLogin()
   console.log("Home Screen")
  }

  componentDidMount(){
    
  }

  // Render any loading content that you like here
  render() {
    return (
      <View styles={styles.container}>
    <Text>Welcome {firebase.auth().currentUser.displayName}!</Text>
      </View>
    );
  }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    logo: {
      height: 120,
      marginBottom: 16,
      marginTop: 64,
      padding: 10,
      width: 135,
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    modules: {
      margin: 20,
    },
    modulesHeader: {
      fontSize: 16,
      marginBottom: 8,
    },
    module: {
      fontSize: 14,
      marginTop: 4,
      textAlign: 'center',
    }
  });

  export const googleLogin = async () => {
    try {
      // Add any configuration settings here:
      await GoogleSignin.configure();
  
      const data = await GoogleSignin.signIn();
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      // login with credential
      const currentUser = await firebase.auth().signInWithCredential(credential);
      console.info(JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }