import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

const handelapilist = async (type) => {
    try {
        const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/List/FindInfo?type=${type}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            console.log('Data fetched successfully');
            const data = await response.json();
            return data;
        } else {
            console.log('Data fetch unsuccessful');
            return null;
        }
    } catch (error) {
        console.error('API call failed', error);
        return null;
    }
};

const DatesList = () => {
    const [isData, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("100");

    const fetchData = (type) => {
        setLoading(true);
        handelapilist(type).then(data => {
            if (data) {
                setData(data.data);
            } else {
                console.log('Empty response data');
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchData(selectedType);
    }, [selectedType]);

    const renderButton = (type) => (
        <TouchableOpacity
            style={[styles.button, selectedType === type ? styles.selectedButton : null]}
            onPress={() => setSelectedType(type)}
        >
            <Text style={styles.buttonText}>{type}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Date: {item.Date}</Text>
            <Text style={styles.itemText}>Month: {item.Month}</Text>
            <Text style={styles.itemText}>Year: {item.Year}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                {renderButton("100")}
                {renderButton("200")}
                {renderButton("750")}
                {renderButton("1500")}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                isData.length > 0 ? (
                    <FlatList
                        data={isData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <Text style={styles.noDataText}>No data available</Text>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#dddddd',
        borderRadius: 8,
    },
    selectedButton: {
        backgroundColor: '#0080ff',
    },
    buttonText: {
        fontSize: 16,
        color: '#333333',
    },
    list: {
        paddingBottom: 20,
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    itemText: {
        color: '#333333',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        textAlign: 'center',
        color: '#333333',
        fontSize: 18,
    },
});

export default DatesList;
