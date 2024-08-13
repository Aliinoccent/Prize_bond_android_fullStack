import React from "react";
import { FlatList, TouchableOpacity, Image, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";




const TrendingItem = () => {
    const [saveBond,setsaveBond]=useState([]);
    const navigation = useNavigation();
    const showbond = (type) => {
        console.log('type', type);
        if (type == 1) {
            handel(100);
            navigation.navigate('Bonds',{saveBond})
        }
        else if (type == 2) {
            handel(200)
            navigation.navigate('Bonds',{saveBond})
        }
        else if (type == 3) {
            handel(750)
            navigation.navigate('Bonds',{saveBond})
        }
        else if (type == 4) {
            handel(1500)
            navigation.navigate('Bonds',{saveBond})

        }

        else
            console.log('it not provide execte data')
    }
    const handel = async (data) => {
        
        
        const token = await AsyncStorage.getItem('dataTypeToken');
        const TokenParse = JSON.parse(token);
        console.log(TokenParse.Token);
        console.log('data', data);
        try {
            const Response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/bonds/allBond?BondType=${data}`, {
                method: 'get',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${TokenParse.Token}`
                }
            });
            if (Response.ok) {
                console.log(Response.status);
                const dataform = await Response.json();
                // console.log(dataform.data)
                setsaveBond(dataform.data);
                // setsaveBond(()=>dataform.data.forEach(bond => console.log(bond.PrizeBondNumber)))
                
                
            }
            else {
                throw Error("network error");
            }
        } catch {
            console.log("fatch error", Response.status);
        }
    };
    // Import locally saved images
    const images = [
        { id: "1", thumbnail: require("../component/src/assets/100.png") },
        { id: "2", thumbnail: require("../component/src/assets/200.jpg") },
        { id: "3", thumbnail: require("../component/src/assets/750.png") },
        { id: "4", thumbnail: require("../component/src/assets/1500.jpg") }
    ];

    return (

        <FlatList
            data={images}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={{ marginRight: 5 }}
                    activeOpacity={0.7}
                    onPress={() => showbond(item.id)} // Example onPress action
                >
                    <Image
                        source={item.thumbnail}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 33,
                            marginBottom: 5,
                            overflow: "hidden",
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 5,
                            elevation: 5,

                        }}
                        resizeMode="contain" // Ensure the full image is displayed
                    />
                </TouchableOpacity>

            )}
        />
    );
};

export default TrendingItem;
