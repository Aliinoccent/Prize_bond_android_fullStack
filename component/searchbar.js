import React, { useState, useContext, useEffect } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon from react-native-vector-icons

import { BondContext } from './Bondshow';

const SearchBar = () => {
    const { setSearchData } = useContext(BondContext);
    const [itemvalue, setitemvalue] = useState('');
    
    useEffect(() => {
        setSearchData(itemvalue);
    }, [itemvalue]);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Icon name="search" size={24} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    placeholder="Search..."
                    placeholderTextColor="gray"
                    onChangeText={setitemvalue}
                    value={itemvalue}
                />
                {itemvalue.length > 0 && (
                    <TouchableOpacity onPress={() => setitemvalue('')} style={styles.clearButton}>
                        <Icon name="close-circle" size={24} color="gray" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingHorizontal: '5%',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    textInput: {
        flex: 1,
        height: 40,
        backgroundColor: 'transparent',
        marginLeft: 10,
        fontSize: 16,
    },
    icon: {
        marginRight: 10,
    },
    clearButton: {
        marginLeft: 10,
    },
});

export default SearchBar;
