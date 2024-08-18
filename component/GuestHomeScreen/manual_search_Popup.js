import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../src/consts/color';

const NoBondsEnteredPopup = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>No Bonds Entered</Text>
          <Text style={styles.message}>Please enter at least one bond number to check for winnings.</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker semi-transparent background for more focus
  },
  modalContent: {
    width: '85%', // Increased width for more space
    padding: 30, // Increased padding for better spacing
    backgroundColor: COLORS.white,
    borderRadius: 15, // Slightly increased border radius
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 7,
  },
  title: {
    fontSize: 25, // Increased font size for more prominence
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15, // Increased margin for better spacing
  },
  message: {
    fontSize: 18, // Increased font size for better readability
    color: 'black',
    textAlign: 'center',
    marginBottom: 25, // Increased margin for better spacing
  },
  closeButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16, // Slightly larger font size for the button text
  },
});

export default NoBondsEnteredPopup;
