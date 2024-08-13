import React, { useEffect, useState } from "react";
import { Text, TextInput, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import Add_Plus from "./Add_Plus";
import STYLES from "./src/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "./src/consts/color";

const UserAddBond = ({ route, navigation }) => {
    const { datatype } = route.params || {}; // Extract datatype from route params
    console.log('Received datatype:', datatype);

    const { handleSubmit, control, reset } = useForm();

    const [bondnum, setbondnum] = useState([]);
    const [inputError, setInputError] = useState('');

    const onsubmit = (data) => {
        const data_Value = data.Type;

        // Manual validation
        if (!/^\d{6}$/.test(data_Value)) {
            setInputError('Enter a valid 6-digit number');
            return;
        }

        setInputError('');
        setbondnum((predata) => [...predata, data_Value]);
        reset({ Type: '' }); // Reset the input field after submission
    };

    const removeBond = (index) => {
        setbondnum((predata) => {
            // Create a shallow copy of the current state array
            const newData = [...predata];
            // Remove the element at the specified index
            newData.splice(index, 1);
            // Return the updated array
            return newData;
        });
    };

    const data = {
        PrizeBondTyp: Number(datatype),
        PrizeBondNumbe: bondnum
    };

    console.log(data);

    useEffect(() => {
        console.log(bondnum);
    }, [bondnum]);

    const DataSave = async () => {
        if (bondnum.length === 0) {
            Alert.alert("Error", "Please add at least one bond number.");
            return;
        }

        const token = await AsyncStorage.getItem('dataTypeToken');
        console.log(token)
        const TokenParse = JSON.parse(token);
        console.log('data save');
        console.log(TokenParse.Token)
        console.log('convert data in number', data);
       
        try {
            const Response = await fetch(
              "https://prize-bond-backend.vercel.app/api/v1/bonds/add",
              {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${TokenParse.Token}` // Adding the token in the Authorization header
                },
                body: JSON.stringify(data)
            });
            if (Response.ok) {
              console.log(Response.status);
              const dataform = await Response.json();
              console.log(dataform);
              Alert.alert("Success", `${bondnum.length} prize bonds have been saved.`);
              setbondnum([]); // Clear the list of prize bonds
              navigation.navigate("User");
            } else {
              throw Error("network error");
            }
        } catch (error) {
            console.log("fetch error", error);
            Alert.alert("Error", "An error occurred while saving the data.");
        }
    };

    return (
        <>
            <View style={{ flexDirection: "column", justifyContent: 'space-between', padding: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <View style={{ flex: 1, height:50,}}>
                                <TextInput
                                    style={{ 
                                        flex: 1,
                                        color: 'black',
                                        backgroundColor: 'white',
                                        borderTopLeftRadius: 30,
                                        borderRadius: 30,
                                        borderWidth: 1,
                                        borderColor: 'black',
                                        paddingLeft: 20,
                                        height: 40 // Ensure consistent height
                                    }}
                                    placeholder="Add bond"
                                    onChangeText={field.onChange}
                                    value={field.value}
                                />
                            </View>
                        )}
                        name="Type"
                    />
                    <Add_Plus handleClick={handleSubmit(onsubmit)} />
                </View>
                
                {/* Error message */}
                {inputError ? (
                    <Text style={{ color: 'red', marginTop: 5, marginLeft: 20 }}>{inputError}</Text>
                ) : null}

                {/* Display bondnum using FlatList */}
                <FlatList
                    data={bondnum}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ 
                                borderRadius: 20,
                                color: COLORS.white,
                                margin: 10,
                                width: '60%', // Fixed width for consistency
                                height: 40,
                                backgroundColor: COLORS.light,
                                textAlign: 'center',
                                paddingVertical: 10
                            }}>
                                {item}
                            </Text>
                            <TouchableOpacity
                                style={{ 
                                    margin: 10,
                                    backgroundColor: COLORS.blue,
                                    padding: 10,
                                    borderRadius: 20
                                }}
                                onPress={() => removeBond(index)}
                            >
                                <Text style={{ color: 'white' }}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                />
            </View>
            <TouchableOpacity
                style={STYLES.btnPrimary}
                onPress={() => DataSave()}
            >
                <Text style={STYLES.buttonText}>Save Bond</Text>
            </TouchableOpacity>
        </>
    );
}

export default UserAddBond;
