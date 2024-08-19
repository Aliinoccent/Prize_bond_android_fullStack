import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ManageStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const token = await AsyncStorage.getItem('dataTypeToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/Store/getStore', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch store details');
        }

        const data = await response.json();
        setStore(data.data);
        setNewDescription(data.data.Description); // Initialize newDescription with current description
      } catch (err) {
        setError(err.error || 'Failed to fetch store details');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const updateDescription = async () => {
    try {
      const token = await AsyncStorage.getItem('dataTypeToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/Store/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_id: store._id,
          newDescription: newDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update store');
      }

      Alert.alert('Success', 'Store updated successfully');
      setModalVisible(false); // Hide the modal after successful update
      // Optionally, refetch the store data here to refresh the UI
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update store');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileItem}>
          <Icon name="storefront-outline" size={24} color="#6200ee" style={styles.icon} />
          <Text style={styles.label}>Store Name:</Text>
          <Text style={styles.value}>{store?.Name}</Text>
        </View>

        <View style={styles.profileItem}>
          <Icon name="text-box-outline" size={24} color="#6200ee" style={styles.icon} />
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{store?.Description}</Text>
        </View>

        <View style={styles.profileItem}>
          <Icon name="city-variant-outline" size={24} color="#6200ee" style={styles.icon} />
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{store?.City}</Text>
        </View>

        <View style={styles.profileItem}>
          <Icon name="map-marker-outline" size={24} color="#6200ee" style={styles.icon} />
          <Text style={styles.label}>Area:</Text>
          <Text style={styles.value}>{store?.Area}</Text>
        </View>

        <View style={styles.profileItem}>
          <Icon name="phone-outline" size={24} color="#6200ee" style={styles.icon} />
          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.value}>{store?.number}</Text>
        </View>

        <View style={styles.profileItem}>
          <Icon name="email-outline" size={24} color="#6200ee" style={styles.icon} />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{store?.Email}</Text>
        </View>
      </View>

      {/* Update Description Section */}
      <TouchableOpacity style={styles.updateButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.updateButtonText}>Update Description</Text>
      </TouchableOpacity>

      {/* Modal for Update Description */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Description</Text>
            <TextInput
              style={styles.input}
              value={newDescription}
              onChangeText={setNewDescription}
              placeholder="Update Description"
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={updateDescription} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 18,
    color: '#555',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 18,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default ManageStore;
