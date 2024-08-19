import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, FlatList, Dimensions, Easing } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from "react-native/Libraries/NewAppScreen";
import COLORS from "./src/consts/color";

const { height } = Dimensions.get('window');

const SliderUpDown = ({ navigation }) => {
  const [showList, setShowList] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const handle = (data) => {
    console.log(data);
    navigation.navigate('addBond', { datatype: data });
  };

  const toggleList = () => {
    if (showList) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start(() => setShowList(false));
    } else {
      setShowList(true);
      Animated.timing(translateY, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    }
  };

  const data = [
    { id: "1", value: "100" },
    { id: "2", value: "200" },
    { id: "3", value: "750" },
    { id: "4", value: "1500" }
  ];

  const animatedStyle = {
    transform: [
      {
        translateY: translateY.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -200], // Adjust based on the height of the list container
        }),
      },
    ],
    opacity: translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={toggleList}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
      {showList && (
        <Animated.View style={[styles.listContainer, animatedStyle]}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemContainer} onPress={() => handle(item.value)}>
                <Text style={styles.item}>{item.value}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary, // Vibrant purple
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Enhanced shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    // Optional gradient background
    // backgroundColor: 'transparent',
    // borderWidth: 2,
    // borderColor: '#fff',
    // borderStyle: 'solid',
  },
  listContainer: {
    position: 'absolute',
    bottom: -95, // Adjust to position list container closer to the plus icon
    right: 0,
    backgroundColor: '#ffffff', // White background
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 10, // Enhanced shadow for the list container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    width: 80, // Adjust width as needed
    maxHeight: height * 0.4, // Limit the height of the list
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light gray for item separation
  },
  item: {
    fontSize: 16,
    color: '#333', // Dark gray text color
  },
});

export default SliderUpDown;
