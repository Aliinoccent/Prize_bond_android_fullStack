import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Image, TouchableOpacity, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import STYLES from './src/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fileaddImage from '../component/src/assets/file.png';
import COLORS from './src/consts/color';


const ManageList = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const list = {
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      };

      const files = new FormData();
      files.append('List', list);
      console.log('List type', typeof (files));
      console.log(files);

      const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/List/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: files,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        setIsAlertVisible(true);
        console.log(jsonResponse);
        await AsyncStorage.setItem('List', JSON.stringify(jsonResponse));
      } else {
        console.log('Error:', response.status);
        Alert.alert('Error', `Upload failed with status ${response.status}`);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error: ', err);
        Alert.alert('Error', 'Failed to upload file');
      }
    }
  };

  useEffect(() => {
    setIsAlertVisible(true);
  }, []);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#073c5d' }}>
      </View>
      <View style={{ flex: 10, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <Image source={fileaddImage} style={{ height: 100, width: 100, color: 'white' }} />
        <Text style={{}}>you need to upload</Text>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Prize Bond List</Text>
        <Text style={{}}>Hi!! add list as upload on current prize bond list</Text>
        <TouchableOpacity
          style={STYLES.btnPrimary}
          onPress={handleDocumentSelection}
        >
          <Text style={[STYLES.buttonText, { padding: 10 }]}>Upload File</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, backgroundColor: '#073c5d' }}>
      </View>

      <Modal visible={isAlertVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsAlertVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>List Format</Text>
              <Text style={styles.modalText}>DRAW OF Rs.40000/- PRIZE BOND</Text>
              <Text style={styles.modalText}>HELD AT LAHORE</Text>
              <Text style={styles.modalText}>Draw No. 77th</Text>
              <Text style={styles.modalText}>Series: Common Draw</Text>
              <Text style={styles.modalText}>Date: 01/03/2018</Text>
              <Text style={styles.modalText}>First Prize of Rs. 75,000,000/-</Text>
              <Text style={styles.modalHighlight}>925437</Text>
              <Text style={styles.modalText}>Second Prize of Rs. 25,000,000/- Each</Text>
              <Text style={styles.modalHighlight}>160579  321143   713514</Text>
              <Text style={styles.modalText}>Third Prize of Rs. 500,000/- Each</Text>
              <Text style={styles.modalHighlight}>000741	035028	063454 continue...</Text>
              
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsAlertVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#073c5d',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
    color: COLORS.pink,
  },
  modalHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: COLORS.pink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageList;
