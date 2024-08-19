import React, { useState, useEffect } from "react";
import { Text, TextInput, View, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import Add_Plus from "./Add_Plus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "./src/consts/color";

const UserAddBond = ({ route, navigation }) => {
    const { datatype } = route.params || {}; // Extract datatype from route params
    const { handleSubmit, control, reset } = useForm();
    const [bondnum, setBondnum] = useState([]);
    const [inputError, setInputError] = useState('');

    const onSubmit = (data) => {
        const data_Value = data.Type;

        // Manual validation
        if (!/^\d{6}$/.test(data_Value)) {
            setInputError('Enter a valid 6-digit number');
            return;
        }

        setInputError('');
        setBondnum((prevData) => [...prevData, data_Value]);
        reset({ Type: '' }); // Reset the input field after submission
    };

    const removeBond = (index) => {
        setBondnum((prevData) => {
            const newData = [...prevData];
            newData.splice(index, 1);
            return newData;
        });
    };

    const data = {
        PrizeBondTyp: Number(datatype),
        PrizeBondNumbe: bondnum
    };

    const dataSave = async () => {
        if (bondnum.length === 0) {
            Alert.alert("Error", "Please add at least one bond number.");
            return;
        }

        const token = await AsyncStorage.getItem('dataTypeToken');
        const TokenParse = JSON.parse(token);
       
        try {
            const response = await fetch(
              "https://prize-bond-backend.vercel.app/api/v1/bonds/add",
              {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${TokenParse.Token}` // Adding the token in the Authorization header
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
              const dataform = await response.json();
              console.log('dataform , data save succss',dataform);
              Alert.alert("Success", `${bondnum.length} prize bonds have been saved.`);
              setBondnum([]); // Clear the list of prize bonds
              navigation.navigate("User");
            } else {
              throw new Error("Network error");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while saving the data.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Controller
                    control={control}
                    render={({ field }) => (
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Add bond"
                                onChangeText={field.onChange}
                                value={field.value}
                            />
                        </View>
                    )}
                    name="Type"
                />
                <Add_Plus handleClick={handleSubmit(onSubmit)} />
            </View>

            {/* Error message */}
            {inputError ? (
                <Text style={styles.errorText}>{inputError}</Text>
            ) : null}

            {/* Display bondnum using FlatList */}
            <FlatList
                data={bondnum}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.bondItemContainer}>
                        <Text style={styles.bondItemText}>
                            {item}
                        </Text>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeBond(index)}
                        >
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.flatListContent}
            />

            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => dataSave()}
            >
                <Text style={styles.saveButtonText}>Save Bond</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    textInputContainer: {
        flex: 1,
        marginRight: 10,
    },
    textInput: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.grey,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        marginLeft: 10,
    },
    bondItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: COLORS.light,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    bondItemText: {
        flex: 1,
        color: COLORS.white,
        textAlign: 'center',
        fontSize: 16,
    },
    removeButton: {
        backgroundColor: COLORS.red,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    removeButtonText: {
        color: 'white',
        fontSize: 14,
    },
    flatListContent: {
        paddingBottom: 80, // Adjust padding to avoid overlapping with the button
    },
    saveButton: {
        backgroundColor: COLORS.blue,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UserAddBond;
