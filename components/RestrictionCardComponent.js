import React, { Component } from 'react'
import { View } from 'react-native'
import {Card} from  'react-native-elements'
import Chip from './chip'

export default class RestrictionCard extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(<Card><View style={{flexDirection:'row'}}>
            {this.props.items.map((item,index)=>{
                return(<Chip key={index} label={item}/>)
            })}
            </View>
        </Card>)
    }
}