import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "./src/consts/color";

const Add_Plus = ({ handleClick }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={handleClick}>
                <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 5,
        right: 10,
        zIndex: 1, // Ensure button is above the list
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plus: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Add_Plus;
