import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../src/consts/color';
import ActiveRouteContext from '../../hooks/ActiveRoute';
import PrizeBondTable from './PrizeBondTable';

const Profile = () => {
  const [, setActiveRoute] = useContext(ActiveRouteContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonText, setButtonText] = useState(''); // State for button text
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { colors } = useTheme();
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('dataTypeToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/users/currentUser', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const result = await response.json();
      console.log(result);

      // Set button text based on isBrokerStatus
      switch (result.data.isBrokerStatus) {
        case 'not created':
          setButtonText('Become Broker');
          break;
        case 'created':
          setButtonText('Waiting');
          break;
        case 'noStore':
          setButtonText('Create Store');
          break;
        case 'store':
          setButtonText('Manage Store');
          break;
        default:
          setButtonText('Become Broker');
          break;
      }

      setUserData(result.data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // End refreshing when data is loaded
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Refetch data on refresh
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('dataTypeToken');
      setActiveRoute('');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleBecomeBroker = async () => {
    try {
      const token = await AsyncStorage.getItem('dataTypeToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/Form/CheckForm', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const result = await response.json();
      console.log(result);

      // Update the button text based on the status
      switch (result.status) {
        case 'not created':
          setButtonText('Become Broker');
          navigation.navigate('Broker Form');
          break;
        case 'created':
          setButtonText('Waiting');
          Alert.alert('Pending Response', 'Working on it');
          break;
        case 'noStore':
          setButtonText('Create Store');
          navigation.navigate('Broker Store Form');
          break;
        case 'store':
          setButtonText('Manage Store');
          navigation.navigate('Manage Store');
          break;
        default:
          setButtonText('Become Broker');
          break;
      }

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.blue]} // Customize the color of the refresh indicator
        />
      }
    >
      <View style={styles.profileContainer}>
        <Avatar.Icon size={100} icon="account" style={styles.avatar} />
        <Text style={styles.username}>{userData.username}</Text>
        <Button
          mode="outlined"
          onPress={handleBecomeBroker}
          style={styles.becomeBrokerButton}
        >
          {buttonText}
        </Button>
      </View>
      <View style={styles.infoSection}>
        <View style={styles.infoContainer}>
          <Icon name="mail-outline" size={24} color={colors.primary} />
          <Text style={styles.infoText}>{userData.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="location-outline" size={24} color={colors.primary} />
          <Text style={styles.infoText}>{userData.Location}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="call-outline" size={24} color={colors.primary} />
          <Text style={styles.infoText}>{userData.number}</Text>
        </View>
      </View>
      <PrizeBondTable />
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Log Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: COLORS.blue,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginTop: 10,
  },
  becomeBrokerButton: {
    marginTop: 10,
    borderColor: COLORS.blue,
    borderWidth: 1,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoText: {
    color: 'gray',
    fontSize: 18,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Profile;
