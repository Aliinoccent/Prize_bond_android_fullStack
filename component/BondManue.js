import React from 'react'
import TrendingItem from './Trading'
import SliderUpDown from './Add_Bond_plus'
import styles from "./src/styles/colors";
import {View,Text} from 'react-native'
import COLORS from "./src/consts/color";

const BondMain=({navigation})=>{
    return(
        <>
         <View style={styles.textView}>
          <Text style={styles.logoOne}>P</Text>
          <Text style={[styles.logoOne, { color: COLORS.secondary }]}>
            rize Bond
          </Text>
        </View>
        <TrendingItem/>
        <SliderUpDown navigation={navigation}/>
        </>
    )
}
export default BondMain;