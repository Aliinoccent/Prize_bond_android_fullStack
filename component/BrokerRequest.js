import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from './loading/lodingIcon';

const BrokerRequest = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);

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

  const addForm = async (formId) => {
    setLoadingAdd(true);
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/Form/update?Form_id=${formId}`, {
        method: 'PUT',
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
    } finally {
      setLoadingAdd(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="user" size={30} color="#007bff" />
        <Text style={styles.title}>{item.Experience}</Text>
      </View>
      <Text style={styles.description}>Description: {item.Description}</Text>
      <Text style={styles.status}>Status: {item.Status ? 'Active' : 'Inactive'}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => deleteForm(item._id)}>
          <Icon name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => addForm(item._id)}>
          <Icon name="plus" size={20} color="#fff" />
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
      {(loading || loadingAdd) ? (
        <Loading />
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
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingVertical: 10,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  status: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default BrokerRequest;
