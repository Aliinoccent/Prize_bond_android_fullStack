import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../src/consts/color";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { Boxcontext } from "./guestDashbord"; // Correct the import path

const GuestBlock = () => {
    const { setbox,setString } = useContext(Boxcontext);
    const navigation = useNavigation();
    const [clickedButton, setClickedButton] = useState(null);

    const handlePress = (button) => {
        setClickedButton(button);
        setString(button);
        console.log(button,'click the button')
         // Example usage of setbox
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text}>Our Services</Text>
            </View>
            <View style={styles.blockContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {handlePress('manual'),setbox(true)}}
                >
                    <Icon 
                        name="hand-left-outline" 
                        size={24} 
                        color={clickedButton === 'manual' ? '#FA8882' : COLORS.white} 
                        style={styles.icon} 
                    />
                    <Text 
                        style={[
                            styles.buttonText, 
                            { color: clickedButton === 'manual' ? '#FA8882' : COLORS.white }
                        ]}
                    >
                        MANUAL BOND
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() =>{ handlePress('range'),setbox(true)}}
                >
                    <Icon 
                        name="bandage-outline" 
                        size={24} 
                        color={clickedButton === 'range' ? '#FA8882' : COLORS.white} 
                        style={styles.icon} 
                    />
                    <Text 
                        style={[
                            styles.buttonText, 
                            { color: clickedButton === 'range' ? '#FA8882' : COLORS.white }
                        ]}
                    >
                        RANGE BOND
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.blockContainer}>
                {/* <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handlePress('schedule')}
                >
                    <Icon 
                        name="calendar-outline" 
                        size={24} 
                        color={clickedButton === 'schedule' ? '#FA8882' : COLORS.white} 
                        style={styles.icon} 
                    />
                    <Text 
                        style={[
                            styles.buttonText, 
                            { color: clickedButton === 'schedule' ? '#FA8882' : COLORS.white }
                        ]}
                    >
                        SCHEDULE
                    </Text>
                </TouchableOpacity> */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {
                        handlePress('lists');

                        // navigation.navigate('List');
                        setbox(true);
                    }}
                >
                    <Icon 
                        name="list-outline" 
                        size={24} 
                        color={clickedButton === 'lists' ? '#FA8882' : COLORS.white} 
                        style={styles.icon} 
                    />
                    <Text 
                        style={[
                            styles.buttonText, 
                            { color: clickedButton === 'lists' ? '#FA8882' : COLORS.white }
                        ]}
                    >
                        LISTS
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    header: {
        width: '90%',
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        color: COLORS.blue,
        fontWeight: 'bold',
    },
    blockContainer: {
        flexDirection: 'row',
        width: '90%',
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    button: {
        flexDirection: 'row',
        width: '45%',
        paddingVertical: 30,
        borderRadius: 20,
        backgroundColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 5,
    }
});

export default GuestBlock;
