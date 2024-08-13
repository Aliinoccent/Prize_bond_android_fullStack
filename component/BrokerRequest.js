import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BrokerRequest = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchTokenAndForms = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('dataTypeToken');
        setToken(storedToken);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchTokenAndForms();
  }, []);

  useEffect(() => {
    if (token) {
      fetchForms();
    }
  }, [token, currentPage]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/Form/getAllForm?page=${currentPage}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('API response:', data);
      if (data && data.data && data.data.forms && data.data.totalPages !== undefined) {
        setForms((prevForms) => [...prevForms, ...data.data.forms]);
        setTotalPages(data.data.totalPages);
      } else {
        console.error('Unexpected response structure:', data);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId) => {
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/Form/delete?Form_id=${formId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();

      try {
        const result = JSON.parse(responseText);

        if (result.success) {
          setForms((prevForms) => prevForms.filter((form) => form._id !== formId));
          Alert.alert('Success', 'Form deleted successfully');
        } else {
          console.error('Error deleting form:', result.message);
          Alert.alert('Error', result.message);
        }
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        console.error('Response text:', responseText);
        Alert.alert('Error', 'Failed to delete form.');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      Alert.alert('Error', 'Failed to delete form.');
    }
  };

  const AddForm = async (formId) => {
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/Form/update?Form_id=${formId}`, {
        method: 'PUT', // Changed from POST to PUT
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add the required fields for the form here if necessary
        }),
      });
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Unexpected response format:", responseText);
        Alert.alert('Error', 'Unexpected response from server');
        return;
      }
  
      const result = await response.json();
  
      if (result.success) {
        Alert.alert('Success', 'Form added successfully');
        setForms(forms => forms.filter(i => i._id !== formId));

      } else {
        console.error('Error adding form:', result.message);
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error adding form:', error);
      Alert.alert('Error', 'Failed to add form.');
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Experience: {item.Experience}</Text>
      <Text style={styles.description}>Description: {item.Description}</Text>
      <Text style={styles.status}>Status: {item.Status ? 'Active' : 'Inactive'}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => deleteForm(item._id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => AddForm(item._id)}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const loadMoreForms = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={forms}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id + index}
          onEndReached={loadMoreForms}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  status: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BrokerRequest;
