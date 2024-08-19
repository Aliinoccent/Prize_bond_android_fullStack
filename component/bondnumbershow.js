import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { BondContext } from './Bondshow';
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "./src/consts/color";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NumberShow = ({ data }) => {
    const { searchData, bondType } = useContext(BondContext);
    const [filteredData, setFilteredData] = useState(data);
    const [prizetype, setPrizetype] = useState(0);

    useEffect(() => {
        // Set the prize type based on the bondType
        const ptype = () => {
            switch (bondType) {
                case '1':
                    setPrizetype(100);
                    break;
                case '2':
                    setPrizetype(200);
                    break;
                case '3':
                    setPrizetype(750);
                    break;
                case '4':
                    setPrizetype(1500);
                    break;
                default:
                    setPrizetype(0);
                    break;
            }
        };
        ptype();
    }, [bondType]);

    useEffect(() => {
        // Filter data whenever searchData or data changes
        const filterData = () => {
            if (searchData) {
                setFilteredData(data.filter(bond => bond.toString().includes(searchData)));
            } else {
                setFilteredData(data);
            }
        };
        filterData();
    }, [searchData, data]);

    const removeBond = async (number) => {
        const token=AsyncStorage.getItem('dataTypeToken')
        try {
            const response = await fetch(
                `https://prize-bond-backend.vercel.app/api/v1/bonds/deleteBond?number=${number}&type=${prizetype}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // If your API requires authentication
                    },
                }
            );

            const result = await response.json();

            if (response.ok) {
                console.log('Bond removed successfully:', result);
                
                // Remove the bond from the filteredData
                setFilteredData(filteredData.filter(bond => bond !== number));
            } else {
                console.error('Failed to remove bond:', result.message);
            }
        } catch (error) {
            console.error('Error removing bond:', error);
        }
    };

    return (
        <SafeAreaView style={{ marginBottom: 30 }}>
            <View>
                {filteredData.length === 0 ? (
                    <Text style={styles.noDataText}>No data found</Text>
                ) : (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemText}>{item}</Text>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeBond(item)}
                                >
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
    },
    itemText: {
        borderRadius: 20,
        color: 'white',
        margin: 10,
        width: '60%',
        height: 40,
        backgroundColor: COLORS.blue,
        textAlign: 'center',
        paddingVertical: 10,
    },
    removeButton: {
        margin: 10,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20,
    },
    removeButtonText: {
        color: 'white',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
    },
});

export default NumberShow;
