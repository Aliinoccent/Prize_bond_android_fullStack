import React, { useState, createContext,useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../src/consts/color';
import GuestBlock from './GuestBlock';
import TextBlock from './TextBlock';
import ManualDialog from './manualDialog';
import { useIsFocused } from '@react-navigation/native';

const Boxcontext = createContext();

const GuestDashboard = () => {
    
    const isFocused = useIsFocused();
    const [box, setbox] = useState(false);
    const [string,setString]=useState('')
    useEffect(() => {
        if (isFocused) {
            console.log('GuestDashboard is focused');
            // Reset any state or perform actions when the screen comes back into focus
            setbox(false);
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View><Text style={styles.welcome}>PRIZE BOND</Text></View>
                <View style={styles.main}>
                    <View>
                        <Text style={styles.welcome}>Welcome</Text>
                        <Text style={{color:'black'}}>Prize bond pro with efficient</Text>
                        <Text style={{color:'black'}}>Details about brokers.</Text>
                    </View>
                    <View>
                        <Image source={require('../../component/src/assets/winner.png')} style={styles.image} />
                    </View>
                </View>
                <Boxcontext.Provider value={{ box, setbox,string,setString }}>
                    <ManualDialog />
                    <GuestBlock />
                    <TextBlock />
                </Boxcontext.Provider>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        marginTop: 30,
        height: '18%',
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
        backgroundColor: COLORS.white
    },
    welcome: {
        fontSize: 23,
        color: COLORS.blue,
        fontWeight: 'bold',
        // backgroundColor:COLORS.blue,
    },
    image: {
        height: 60,
        width: 60,
    }
});

export default GuestDashboard;
export { Boxcontext };
