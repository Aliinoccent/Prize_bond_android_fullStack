import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Loading from '../loading/lodingIcon'; // Ensure this is the correct path
import Icon from 'react-native-vector-icons/MaterialIcons';

const handelapilist = async (type) => {
    try {
        const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/List/FindInfo?type=${type}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
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
                setData([]);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
            setData([]);
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
            <Icon name="filter-list" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>{type}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Icon name="date-range" size={24} color="#333" style={styles.icon} />
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemText}>Date: {item.Date}</Text>
                <Text style={styles.itemText}>Month: {item.Month}</Text>
                <Text style={styles.itemText}>Year: {item.Year}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.buttonContainer}>
                    {renderButton("100")}
                    {renderButton("200")}
                    {renderButton("750")}
                    {renderButton("1500")}
                </View>

                {loading ? (
                    <Loading />  // Use your Loading component here
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
            </ScrollView>

            {loading && <Loading />}  
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
        position: 'relative',  // Ensure the container is positioned relative
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderRadius: 8,
    },
    selectedButton: {
        backgroundColor: '#0056b3',
    },
    buttonText: {
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 8,
    },
    list: {
        paddingBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    itemTextContainer: {
        marginLeft: 16,
    },
    itemText: {
        color: '#333333',
        fontSize: 16,
    },
    icon: {
        width: 30,
        height: 30,
    },
    noDataText: {
        textAlign: 'center',
        color: '#333333',
        fontSize: 18,
    },
});

export default DatesList;
