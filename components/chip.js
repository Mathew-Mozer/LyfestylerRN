import React, { Component } from 'react'
import { View,Text,StyleSheet } from 'react-native'

export default class Chip extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(<View style={styles.RoundBorder}>
            <Text>{this.props.label}</Text>
        </View>)
    }
}

const styles = StyleSheet.create({
    RoundBorder:{
        alignSelf: 'flex-start',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
        color:'#fff',
        textAlign:'center',
        backgroundColor:'#68a0cf',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#fff'
    }
  });
