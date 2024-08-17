import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const CustomHeader = () => (
  <View style={styles.headerContainer}>
    <Image
      source={require('../component/src/assets/logo.png')} 
      style={styles.headerImage}
    />
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get('window').width, // Ensure the container takes the full width of the screen
    flex: 1, // Use flex to ensure the container takes up the necessary height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    // backgroundColor: '#232322',
    // position: 'absolute', // Ensure the header is positioned correctly
  },
  headerImage: {
    position:'relative',
      width: 150,
    height: 90,
    right:20
  },
});

export default CustomHeader;
