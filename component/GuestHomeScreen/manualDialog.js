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
            setClicknumber(null);
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
                            <Icon name="close" size={24} color="white" />
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
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    dialog: {
        width: '85%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    closeheader: {
        position: 'relative',
        top: 1,
        right: 4,
        zIndex: 1,
        padding: 4,
        borderRadius: 5,
        backgroundColor: COLORS.blue, // original background color
    },
    content: {
        width: '100%',
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: COLORS.blue,
        alignItems: 'center',
        marginVertical: 5,
        elevation: 3,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ManualDialog;
