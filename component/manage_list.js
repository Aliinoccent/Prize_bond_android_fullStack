import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Image, TouchableOpacity, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import fileaddImage from '../component/src/assets/file.png';
import COLORS from './src/consts/color';
import Loading from './loading/lodingIcon';

const ManageList = ({ navigation }) => {
  const [isInitialModalVisible, setIsInitialModalVisible] = useState(true);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const [firstFiveNumbers, setFirstFiveNumbers] = useState([]);
  const [lastFiveNumbers, setLastFiveNumbers] = useState([]);
  const [id , setId]=useState(null)
  const [loading, setLoading] = useState(false);
  const [prizeBondData, setPrizeBondData] = useState({
    PrizeBondAmount: '',
    Year: '',
    Month: '',
    Date: '',
    FirstPrize: '',
    FirstWin: [],
    SecondPrize: '',
    SecondWin: [],
    ThirdPrize: []
  });
  const [ListId, setListId] = useState('');

  const handleDocumentSelection = async () => {
    try {
      setLoading(true);
  
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.plainText], // Only allow text files
      });
  
      // Validate the file type
      const fileType = result[0].type;
      if (fileType !== 'text/plain') {
        Alert.alert('Invalid File Type', 'Only text files are allowed.');
        setLoading(false);
        return;
      }
  
      const list = {
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      };
  
      const files = new FormData();
      files.append('List', list);
  
      const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/List/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: files,
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        console.log(jsonResponse.ThirdPrize);
  
        // Extract and sort the ThirdWin array
        let thirdWin = jsonResponse.data.ThirdWin;
        thirdWin = thirdWin.sort((a, b) => a - b);
  
        setFirstFiveNumbers(thirdWin.slice(0, 5));
        setLastFiveNumbers(thirdWin.slice(-5));
  
        setPrizeBondData({
          PrizeBondAmount: jsonResponse.data.PrizeBondAmount,
          Year: jsonResponse.data.Year,
          Month: jsonResponse.data.Month,
          Date: jsonResponse.data.Date,
          FirstPrize: jsonResponse.data.FirstPrize,
          FirstWin: jsonResponse.data.FirstWin,
          SecondPrize: jsonResponse.data.SecondPrize,
          SecondWin: jsonResponse.data.SecondWin,
          ThirdPrize: jsonResponse.data.ThirdPrize 
        });
        
        setListId(jsonResponse.data._id); 
        console.log(jsonResponse.data._id); // Set the ListId from response
        setIsInitialModalVisible(false);
        setIsResponseModalVisible(true);
  
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
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setIsInitialModalVisible(true);
  }, []);
 
  const handleAdd = () => {
    navigation.goBack(); // Navigate back when "save" is pressed
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/List/Delete?ListId=${ListId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Success', 'List deleted successfully.');
        setIsResponseModalVisible(false);
      } else {
        Alert.alert('Error', `Failed to delete list. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error.error);
      Alert.alert('Error', 'Failed to delete list.');
    }
  };
  const handleSave = async () => {
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/List/save?ListId=${ListId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Success', 'List deleted successfully.');
        setIsResponseModalVisible(false);
      } else {
        Alert.alert('Error', `Failed to delete list. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error.error);
      Alert.alert('Error', 'Failed to delete list.');
    }
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#073c5d' }} />
      <View style={{ flex: 10, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Image source={fileaddImage} style={{ height: 100, width: 100, color: 'white' }} />
            <Text>You need to upload</Text>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Prize Bond List</Text>
            <Text>Hi!! add list as upload on current prize bond list</Text>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleDocumentSelection}
            >
              <Text style={[styles.buttonText, { padding: 10,fontSize:20 }]}>Upload File</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={{ flex: 1, backgroundColor: '#073c5d' }} />

      {/* Initial Modal */}
      <Modal visible={isInitialModalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsInitialModalVisible(false)}>
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
              <Text style={styles.modalHighlight}>000741  035028  063454 continue...</Text>
              
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsInitialModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Response Modal */}
      <Modal visible={isResponseModalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsResponseModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Uploaded List Summary</Text>
              <Text style={styles.modalHighlight}>Year: {prizeBondData.Year}</Text>
              <Text style={styles.modalHighlight}>Month: {prizeBondData.Month}</Text>
              <Text style={styles.modalHighlight}>Date: {prizeBondData.Date}</Text>
              <Text style={styles.modalHighlight}>Prize Bond Amount: {prizeBondData.PrizeBondAmount}</Text>
              <Text style={styles.modalHighlight}>First Prize: {prizeBondData.FirstPrize}</Text>
              <Text style={styles.modalText}>First Win: {prizeBondData.FirstWin.join(', ')}</Text>
              <Text style={styles.modalHighlight}>Second Prize: {prizeBondData.SecondPrize}</Text>
              <Text style={styles.modalText}>Second Win: {prizeBondData.SecondWin.join(', ')}</Text>
              <Text style={styles.modalHighlight}>Third Prize: {prizeBondData.ThirdPrize}</Text>   
               <Text style={styles.modalText}>First 5 Numbers:</Text>
              <Text style={styles.modalHighlight}>{firstFiveNumbers.join('   ')}</Text>
              <Text style={styles.modalText}>Last 5 Numbers:</Text>
              <Text style={styles.modalHighlight}>{lastFiveNumbers.join('   ')}</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                  <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  modalHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ManageList;