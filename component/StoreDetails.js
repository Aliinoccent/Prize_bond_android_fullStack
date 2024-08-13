import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const StoreDetails = ({ route }) => {
    const { storeId } = route.params;
    console.log(storeId,'this is storeid')
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/Store/getStore?id=${storeId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data,'store data')
        setStore(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.log(err,'error is this')
        setLoading(false);
      }
    };
  
    fetchStore();
  }, [storeId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  if (!store) {
    return <Text style={styles.error}>Store not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Details</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.text}>{store.Name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.text}>{store.Description}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.text}>{store.Location}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Number:</Text>
        <Text style={styles.text}>{store.number}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{store.Email}</Text>
      </View>
      {/* Add any other fields you need to display */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  infoContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color:'black'
  },
  text: {
    marginLeft: 10,
    color:'gray'
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default StoreDetails;