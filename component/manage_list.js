import React from 'react';
import { View, Button, Alert, Image, TouchableOpacity, Text } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import STYLES from './src/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the image
import fileaddImage from '../component/src/assets/file.png';

const ManageList = () => {
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
        Alert.alert('Success', 'File uploaded successfully!');
        console.log(jsonResponse);
        await AsyncStorage.setItem('List',JSON.stringify(jsonResponse));
      } else {
        console.log('Error:', response.status);
        Alert.alert('Error', `Upload failed with status ${response.status}hahaha`);
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

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#073c5d' }}>
      </View>
      <View style={{ flex: 10, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        {/* Use the imported image */}
        <Image source={fileaddImage} style={{ height: 100, width: 100, color: 'white' }} />
        <Text style={{}}>you need to upload</Text>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Prize Bond List</Text>
        <Text style={{}}>Hi!! add list as upload on current prize bond list</Text>
        <TouchableOpacity
          style={STYLES.btnPrimary}
          onPress={handleDocumentSelection}
        >
          <Text style={[STYLES.buttonText, { padding: 10 }]}>upload file</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, backgroundColor: '#073c5d' }}>


      </View>
    </>
  );
};

export default ManageList;
