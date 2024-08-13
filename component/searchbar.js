import React, { useState, useContext, useEffect } from "react";
import { TextInput, View } from "react-native";
import { StyleSheet } from "react-native";
import { BondContext } from './Bondshow';

const SearchBar = () => {

    const {  setSearchData } = useContext(BondContext);
    const [itemvalue,setitemvalue]=useState('');
    
    useEffect(()=>{
       setSearchData(itemvalue);
    
    },[itemvalue])

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder="search..."
                onChangeText={setitemvalue}
                value={itemvalue}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '15%',
        backgroundColor: '#FA8882',
        justifyContent: 'center',
        paddingHorizontal: '5%',
    },
    textInput: {
        height: 40,
        backgroundColor: 'white',
        marginHorizontal: '5%',
        borderRadius: 25,
        paddingHorizontal: 10,
    },
});

export default SearchBar;
