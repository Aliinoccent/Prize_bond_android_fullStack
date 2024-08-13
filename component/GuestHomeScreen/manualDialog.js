import React, { useEffect, useState, useContext } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../src/consts/color";
import { Boxcontext } from "./guestDashbord";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';

const ManualDialog = () => {
    const navigation = useNavigation();
    const numbers = [100, 200, 750, 1500];
    const { box, setbox, string } = useContext(Boxcontext);
    const [clicknumber, setClicknumber] = useState(null);

    useEffect(() => {
        if (clicknumber != null) {
            setbox(false);
            navigation.navigate('Manual Bonds', { bondNumber: clicknumber, bondType: string });
            setClicknumber(null); // Reset clicknumber after navigation
        }
    }, [clicknumber]);

    const numberClick = (numbervalue) => {
        setClicknumber(numbervalue);
    };

    const closeDialog = () => {
        setbox(false);
    };

    return (
        <Modal visible={box} transparent={true} animationType="slide">
            <View style={styles.container}>
                <View style={styles.dialog}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Bond Number</Text>
                        <TouchableOpacity onPress={closeDialog} style={styles.closeheader}>
                        <Icon name="close" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        {numbers.map((value, index) => (
                            <TouchableOpacity key={index} style={styles.button} onPress={() => numberClick(value)}>
                                <Text style={styles.buttonText}>{value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dialog: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 22,
        fontWeight: '900',
        color: 'red',
    },
    content: {
        width: '100%',
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 5,
        backgroundColor: COLORS.blue,
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    closeheader:{
        position:'relitive',
        top: 1,
        right: 4,
        zIndex: 1,
        padding:4,
        borderRadius:5,
        backgroundColor:COLORS.blue
    }
});

export default ManualDialog;
