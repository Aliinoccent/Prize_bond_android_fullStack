import React, { useState, createContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../src/consts/color';
import GuestBlock from './GuestBlock';
import TextBlock from './TextBlock';
import ManualDialog from './manualDialog';
import { useIsFocused } from '@react-navigation/native';
import PrizeBondTable from '../user/PrizeBondTable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Boxcontext = createContext();

const GuestDashboard = () => {
    
    const isFocused = useIsFocused();
    const [box, setbox] = useState(false);
    const [string, setString] = useState('');
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        if (isFocused) {
            console.log('GuestDashboard is focused');
            setbox(false);
        }
    }, [isFocused]);

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                const token = await AsyncStorage.getItem('dataTypeToken');
                if (token) {
                    const parsedToken = JSON.parse(token);
                    console.log(parsedToken.userType);
                    setUserType(parsedToken.userType); // Assuming the type is stored in the token
                } else {
                    console.log('No token found');
                }
            } catch (error) {
                console.error('Error fetching user type:', error);
            }
        };
        
        fetchUserType();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.welcome}>PRIZE BOND</Text>
                <View style={styles.main}>
                    <View>
                        <Text style={styles.welcome}>Welcome</Text>
                        <Text style={styles.description}>Prize bond pro with efficient</Text>
                        <Text style={styles.description}>Details about brokers.</Text>
                    </View>
                    <Image source={require('../../component/src/assets/winner.png')} style={styles.image} />
                </View>
                <Boxcontext.Provider value={{ box, setbox, string, setString }}>
                    <ManualDialog />
                    <GuestBlock />
                    <TextBlock />
                    {userType === 'user' && <PrizeBondTable />} 
                    {userType==='broker' &&<PrizeBondTable/>}
                </Boxcontext.Provider>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 16,
    },
    main: {
        marginTop: 30,
        height: 180, // Adjusted to a fixed height
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 30,
        shadowColor: 'black',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 15,
        backgroundColor: COLORS.white,
        padding: 10,
    },
    welcome: {
        fontSize: 23,
        color: COLORS.blue,
        fontWeight: 'bold',
    },
    image: {
        height: 60,
        width: 60,
    },
    description: {
        color: 'black',
    },
});

export default GuestDashboard;
export { Boxcontext };
