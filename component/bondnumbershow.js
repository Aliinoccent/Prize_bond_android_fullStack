import React, { useContext } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { BondContext } from './Bondshow';
import { SafeAreaView } from "react-native-safe-area-context";

const NumberShow = ({ data }) => {
    const { searchData } = useContext(BondContext);
    console.log(typeof(searchData));



    const filteredData = searchData
    ? data.filter(bond => bond.toString().includes(searchData))
    : data;

    const removeBond = (index) => {
        console.log(`Remove bond at index: ${index}`);
    };
    return (
        <SafeAreaView style={{ marginBottom: 30 }}>
            <View >
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
                                    onPress={() => removeBond(index)}
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
}

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
    },
    itemText: {
        borderRadius: 20,
        color: 'black',
        margin: 10,
        width: '60%',
        height: 40,
        backgroundColor: '#FA8882',
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
