import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationScreen = () => {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBondDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('dataTypeToken');
        const TokenParse = JSON.parse(token);

        if (!token) {
          throw new Error('User token not found');
        }

        const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/bondWin/allWinbond', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TokenParse}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bonds');
        }

        const data = await response.json();
        setBonds(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBondDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={styles.loadingText}>Loading bonds...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Icon name="error-outline" size={50} color="#FF6F61" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {bonds.length > 0 ? (
        bonds.map((bond, index) => (
          <View key={index} style={styles.bondCard}>
            <Text style={styles.bondTitle}>{bond.PrizeBondType}</Text>
            <Text style={styles.bondText}>Number: <Text style={styles.bondTextHighlight}>{bond.PrizeBondNumber}</Text></Text>
            <Text style={styles.bondText}>Amount Won: <Text style={styles.bondTextHighlight}>${bond.AmountWin}</Text></Text>
            <Text style={styles.bondText}>Positions: <Text style={styles.bondTextHighlight}>{bond.WinPosition.join(', ')}</Text></Text>
            <Text style={styles.bondText}>Month: <Text style={styles.bondTextHighlight}>{bond.Month}</Text></Text>
            <Text style={styles.bondText}>Year: <Text style={styles.bondTextHighlight}>{bond.Year}</Text></Text>
          </View>
        ))
      ) : (
        <Text style={styles.noBondsText}>No winning bonds found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#FF6F61',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#FF6F61',
    textAlign: 'center',
    marginTop: 20,
  },
  bondCard: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  bondTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 10,
  },
  bondText: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 8,
  },
  bondTextHighlight: {
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  noBondsText: {
    fontSize: 18,
    color: '#95A5A6',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationScreen;