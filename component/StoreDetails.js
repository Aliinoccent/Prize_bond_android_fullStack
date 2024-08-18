import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icon library for professional icons
import COLORS from './src/consts/color'; // Adjust the path according to your project structure

const StoreDetails = ({ route }) => {
  const { storeId } = route.params;
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
        setStore(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  if (!store) {
    return <Text style={styles.error}>Store not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Store Details</Text>
      <View style={styles.infoContainer}>
        <Icon name="business" size={24} color={COLORS.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.text}>{store.Name}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="description" size={24} color={COLORS.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.text}>{store.Description}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="location-on" size={24} color={COLORS.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.text}>{store.Location}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="phone" size={24} color={COLORS.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Number:</Text>
          <Text style={styles.text}>{store.number}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="email" size={24} color={COLORS.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>{store.Email}</Text>
        </View>
      </View>
    </ScrollView>
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
    color: COLORS.blue,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  text: {
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

export default StoreDetails;
