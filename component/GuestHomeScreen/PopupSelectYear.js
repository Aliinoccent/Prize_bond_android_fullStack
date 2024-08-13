import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from "../src/consts/color";
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { prizeContext } from "./MnualBondScreen";
import { useContext } from "react";

const PopupSelectYear = ({ visible, onClose, years, months, onSelectYear, onSelectMonth, selectedYear, selectedMonth, loadingYears, loadingMonths, functionHandel }) => {
    // console.log(years);
   
    const stringYears = years.map(year => year.toString());
    // console.log(stringYears);
    const stringMonths = months.map(month => month.toString());
    // console.log(stringMonths);

    const handleSubmit = () => {
        functionHandel();
        onClose();
        
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.container}>
                <View style={styles.dialog}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
                    <Icon name="close" size={24} color="red" />

                    </TouchableOpacity>
                    <Text style={styles.title}>Select Year and Month</Text>
                    {loadingYears ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <ModalDropdown
                            options={stringYears}
                            defaultValue="Select Year"
                            onSelect={(index, value) => onSelectYear(value)}
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            dropdownStyle={styles.dropdownDropdownStyle}
                            defaultIndex={0}
                        />
                    )}
                    {loadingMonths ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <ModalDropdown
                            options={stringMonths}
                            defaultValue="Select Month"
                            onSelect={(index, value) => onSelectMonth(value)}
                            style={[styles.dropdown, !selectedYear && styles.disabledDropdown]}
                            textStyle={styles.dropdownText}
                            dropdownStyle={styles.dropdownDropdownStyle}
                            disabled={!selectedYear}
                            defaultIndex={0}
                        />
                    )}
                    <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dropdown: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    dropdownText: {
        fontSize: 16,
        color: '#000',
    },
    dropdownDropdownStyle: {
        width: 250,
        maxHeight: 200,
    },
    disabledDropdown: {
        backgroundColor: '#e0e0e0',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        padding:4,
        borderRadius:5,
        backgroundColor:COLORS.blue
    },
});

export default PopupSelectYear;
