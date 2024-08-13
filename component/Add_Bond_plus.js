import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
const SliderUpDown = ({navigation}) => {
  const handle=(data)=>{
    console.log(data)
navigation.navigate('addBond',{datatype:data});
  }
  const [showList, setShowList] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;


  const toggleList = () => {
    setShowList(!showList);
    if (!showList) {
      Animated.timing(translateY, {
        toValue: -10,
        duration: 1000,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 10,
        duration:1000,
        useNativeDriver: true

      }).start();
    }
  };

  const data = [
    { id: "1", value: "100" },
    { id: "2", value: "200" },
    { id: "3", value: "750" },
    { id: "4", value: "1500" }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={toggleList}>
      <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
      {showList && (
        <Animated.FlatList
          data={data}
          style={[styles.list, { transform: [{ translateY }] }]}
          keyExtractor={item => item.id}
          renderItem={({ item }) =><TouchableOpacity onPress={()=>handle(item.value)}><Text style={styles.item}>{item.value}</Text></TouchableOpacity> }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 1, // Ensure button is above the list
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    position: 'absolute',
    bottom: 60, // Adjust based on the button size
    left: 10,
    width: 80,
    maxHeight: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
  item: {
    padding: 10,
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});



export default SliderUpDown;