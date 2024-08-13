import React, { useEffect, useState } from "react";
import { Text, View ,FlatList,StyleSheet, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../src/consts/color";

const DrawListShow = ({route}) => {
    const {bondType}=route.params;
    const [listnumber, setlistnumber] = useState(null);
    useEffect(()=>{console.log(bondType,'bondtype is checked ho gi ha')},[bondType])

    useEffect(() => {
        handleList();
    }, []);

    const handleList = async () => {
        try {
            const ListData = await AsyncStorage.getItem('List');
            const jsondata = JSON.parse(ListData);
            setlistnumber(jsondata);
            console.log(jsondata);
        } catch (error) {
            console.log('local storage data is empty or could not be retrieved');
        }
    };
    const listobject = {
        FirstPrize: listnumber?.data?.FirstPrize || [],
        FirstWin: listnumber?.data?.FirstWin || [],
        SecondPrize: listnumber?.data?.SecondPrize || [],
        SecondWin: listnumber?.data?.SecondWin || [],
        ThirdPrize: listnumber?.data?.ThirdPrize || [],
        ThirdWin: listnumber?.data?.ThirdWin || [],
    };
    const modifyList = () => {  
        return listobject?.ThirdWin?.sort((a, b) => a - b) || [];
    };

    const showlist = (sortlist) => {
        Secondnumbers=listobject.SecondWin.map(element=>{return element}).join('    ')
        console.log(Secondnumbers)
        return (
            <View style={styles.container}>
                
                <Text style={{fontSize:20,color:COLORS.blue,fontWeight:900}}>FIRST PRIZE BOND</Text>
                <Text style={{color:COLORS.blue,fontSize:16,fontWeight:'bold', marginTop:10}}>{listobject.FirstWin}</Text>
                <Text style={{fontSize:20,color:COLORS.blue,fontWeight:'bold',marginTop:10}}>Second Prize of {listobject.SecondPrize}</Text>
                <Text style={{color:COLORS.blue,fontSize:16,fontWeight:'bold', marginTop:10}}>{Secondnumbers}</Text>
                <Text style={{fontSize:20,color:COLORS.blue,fontWeight:'bold',marginTop:10}}>3rd Prize of {listobject.ThirdPrize}</Text>
                <FlatList
                    data={sortlist}
                    keyExtractor={(element, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={{ fontWeight:'bold',fontSize:14,color:'black'}}>{item}</Text>
                        </View>
                    )}
                    numColumns={4} // Set the number of columns
                />
            </View>
        );
    };
    

    return (
        <View>
            
            {showlist(modifyList())}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '90%',
        alignSelf: 'center',
    },
    item: {
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
       
    },
});

export default DrawListShow;
