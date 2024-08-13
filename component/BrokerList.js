import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BrokerList = () => {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserType = () => {
      fetchStores();
    };
    checkUserType();
  }, [page, retryCount]);

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/Store/getAllStore?page=${page}&location=`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setStores(prevStores => page === 1 ? data.data : [...prevStores, ...data.data]); // Reset stores if refreshing
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
      if (retryCount < 3) {
        setRetryCount(retryCount + 1);
      }
    } finally {
      setLoading(false);
      setRefreshing(false); // Reset refreshing state
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1); // Reset page to 1
    setRefreshing(true); // Set refreshing state to true
    fetchStores(); // Fetch data again
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    if (error && stores.length === 0) {
      return (
        <View style={styles.footer}>
          <Text>Error loading data. Please try again.</Text>
          <Button title="Retry" onPress={() => setRetryCount(retryCount + 1)} />
        </View>
      );
    }
    return null;
  };

  const handleCardPress = async (id) => {
    const token = await AsyncStorage.getItem('dataTypeToken');
    if (!token) {
      Alert.alert('Please sign in first', '', [{ text: 'Sign In', onPress: () => navigation.navigate('signin') }]);
    } else {
      setSelectedId(id);
      navigation.navigate('StoreDetails', { storeId: id });
    }
  };

  return (
    <FlatList
      data={stores}
      keyExtractor={(item, index) => item._id ? `${item._id}-${index}` : `${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleCardPress(item._id)} style={styles.card}>
          <Text style={styles.storeName}>{item.Name}</Text>
          {/* <Text style={styles.storeDescription}>{item.Description}</Text> */}
          <Text style={styles.storeLocation}>{item.Location}</Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing} // Pass refreshing state to FlatList
      onRefresh={handleRefresh} // Handle pull-to-refresh
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  storeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginVertical: 5,
  },
  storeLocation: {
    fontSize: 14,
    color: '#95a5a6',
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
});
  
export default BrokerList;
