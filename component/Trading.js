import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Loading from "./loading/lodingIcon"; // Ensure the path is correct

const TrendingItem = () => {
    const [saveBond, setSaveBond] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [navigate, setNavigate] = useState(false); // Add navigate state
    const [selectedBondType, setSelectedBondType] = useState(null); // Track selected bond type
    const [type, setType] = useState(0);
    const navigation = useNavigation();

    const showBond = async (type) => {
        const bondData = {
            '1': 100,
            '2': 200,
            '3': 750,
            '4': 1500
        }[type];
    
        if (bondData) {
            setLoading(true); // Start loading
            setType(bondData); // Set the bond data type
            setSelectedBondType(type); // Set selected bond type
            await handle(bondData);
        } else {
            console.log('Invalid type');
        }
    };
    
    const handle = async (data) => {
        const token = await AsyncStorage.getItem('dataTypeToken');
        const TokenParse = JSON.parse(token);
        try {
            const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/bonds/allBond?BondType=${data}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${TokenParse.Token}`
                }
            });
            if (response.ok) {
                const dataform = await response.json();
                setSaveBond(dataform.data);
                setLoading(false); // End loading
                setNavigate(true); // Set navigate flag
            } else {
                throw new Error("Network error");
            }
        } catch (error) {
            console.log("Fetch error", error.message);
            setLoading(false); // End loading on error
        }
    };

    useEffect(() => {
        if (navigate && saveBond.length > 0) {
            navigation.navigate('Bonds', { saveBond, BondType: selectedBondType });
            setNavigate(false); // Reset navigate flag
        }
    }, [navigate, saveBond, navigation, selectedBondType]);
    
    const bonds = [
        { id: "1", amount: 100, color: '#FFDDC1', fontSize: 28 },
        { id: "2", amount: 200, color: '#FFABAB', fontSize: 28 },
        { id: "3", amount: 750, color: '#FFC3A0', fontSize: 24 },
        { id: "4", amount: 1500, color: '#FF677D', fontSize: 24 }
    ];

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <Loading /> // Show loading component when fetching
            ) : (
                <FlatList
                    data={bonds}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.cardContainer, { backgroundColor: item.color }]}
                            activeOpacity={0.9}
                            onPress={() => showBond(item.id)}
                        >
                            <View style={styles.card}>
                                <Text style={[styles.amountText, { fontSize: item.fontSize }]}>₨ {item.amount}</Text>
                                <Text style={styles.descriptionText}>Prize Bond</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginRight: 15,
        marginVertical: 10,
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
        width: 160,
        height: 200,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    amountText: {
        fontWeight: 'bold',
        color: 'black',
    },
    descriptionText: {
        fontSize: 16,
        color: 'black',
        marginTop: 5,
    },
});

export default TrendingItem;
