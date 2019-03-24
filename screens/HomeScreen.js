import React from 'react';
import {
  View, StyleSheet,Button,Alert,WebView
} from 'react-native';
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';
import RestrictionCard from '../components/RestrictionCardComponent';
import { baseUrl } from '../shared/baseUrl'
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation'

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('todos');
           
    this.state={
      lyfestyles:[],
      accessToken:"",
      restrictions:["Wheat","Gluten"],
      webViewUrl:""
    }
    
  }
  tabs = [
    {
      key: 'games',
      icon: 'gamepad-variant',
      label: 'Games',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'movies-tv',
      icon: 'movie',
      label: 'Movies & TV',
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'music',
      icon: 'music-note',
      label: 'Music',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    }
  ]
  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} color="white" name={icon} />
  )

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )
  componentDidMount(){
    //fetchLyfeStyles()
    
    googleLogin().then((data)=>{
      const base = `${baseUrl}/home/${data.accessToken}`
      console.log("bases",base)
      return(this.setState({
        accessToken:data.accessToken,
        webViewUrl:base
      }))
    }
    )
  }
  scannedBarcode = (data) =>{
    console.log('Returned Data', JSON.stringify(data))
    this.setState({webViewUrl:`https://woeplus.azurewebsites.net/scan/${data.data}/${data.type}`})
  }
  // Render any loading content that you like here
  render() {
    let yourAlert = 'window.isNative="true"'
    return (/*
      <View styles={styles.container}>
          <Text>Welcome {firebase.auth().currentUser.displayName}!</Text>
          <RestrictionCard items={this.state.restrictions}/>
      </View>
      */
     
     <View style={{flex: 1}}>
       <WebView
        ref="webview"
        injectedJavaScript={yourAlert}
        source={{ uri: this.state.webViewUrl }} style={{ marginTop: 20  }} />
    <View><Button onPress={()=>this.props.navigation.navigate('BarcodeScan',{onGoBack: (data)=>this.scannedBarcode(data)})} title="Scan Barcode" ></Button></View>
    <BottomNavigation
            onTabPress={newTab => this.setState({ activeTab: newTab.key })}
            renderTab={this.renderTab}
            tabs={this.tabs}
          />
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
  
      return(await GoogleSignin.signIn());
      //create a new firebase credential with the token
      //const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      // login with credential
      //const currentUser = await firebase.auth().signInWithCredential(credential);
      //console.info("Id Token",data.idToken);
      
      
    } catch (e) {
      console.error(e);
    }
  }

  export const fetchLyfeStyles = () => {
    console.log("uid",JSON.stringify(firebase.auth().currentUser))
    if (firebase.auth().currentUser) {
        //let ls = firebase.firestore().collection("lyfestyles")
        console.log("uid",firebase.auth().currentUser.uid)
        let subscriptions = firebase.firestore().collection("subscriptions").where('userid', '==', firebase.auth().currentUser.uid)
        subscriptions.onSnapshot(snapshot => {
            snapshot.docChanges.forEach(change=>{
                if(change.type==='added'){
                    getSubscribeLyfestyle(change.doc)
                }
                if(change.type==='modified'){
                    getSubscribeLyfestyle(change.doc)
                }
            })
            snapshot.docs.forEach(change => {
                
            })
            
        }, err => console.log("error in Fetch LyfeStyles"))
    } else {
        addLyfeStyles([])
    }
}

const getSubscribeLyfestyle = (subscriptionData) => {
  let lyfestyles = firebase.firestore().collection("lyfestyles").where(firebase.firestore.FieldPath.documentId(),"==",subscriptionData.data().lyfestyleid)
  lyfestyles.onSnapshot(lssnapshot => {
      lssnapshot.docChanges.forEach(change => {
          if (change.type === 'added') {
              console.log('LyfeStyle Change Added: ', change.doc.id);
              //dispatch({type:ActionTypes.ADD_LYFESTYLE,payload:{id:change.doc.id,subscriptionId:subscriptionData.id,active:subscriptionData.data().active,...change.doc.data()}})
          }
          if (change.type === 'modified') {
            console.log('LyfeStyle Change Modified: ', change.doc.data());
            //dispatch({type:ActionTypes.UPDATE_LYFESTYLE,payload:{id:change.documentId,subscriptionId:subscriptionData.id,active:subscriptionData.data().active,...change.doc.data()}})
          }
          if (change.type === 'removed') {
            console.log('LyfeStyle Change Removed: ', change.doc.data());
           // dispatch({type:ActionTypes.DELETE_LYFESTYLE,payload:{id:change.documentId,...change.doc.data()}})
          }
      })
  }, err => console.log("Error in GetSubs"))
}