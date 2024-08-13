import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../src/consts/color';
import ActiveRouteContext from '../../hooks/ActiveRoute';
import PrizeBondTable from './PrizeBondTable';

const ProfileAdmin = () => {
  const [, setActiveRoute] = useContext(ActiveRouteContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
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
        setUserData(result.data);
        console.log(result.data, 'this is response of profile');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      // const tokentype = JSON.parse(token);
      // console.log(tokentype.Token);
      console.log(token)

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/Form/CheckForm', {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const result = await response.json();
      // Alert.alert('Success', 'You have successfully become a broker');
      console.log(result, 'Become Broker response is sssssssssssss');
      
      if(result.status=== "not created"){
         navigation.navigate('Broker Form')
      }
      else {
        console.log('this is token',token.userType)
        Alert.alert('Form submitted','from has been submitted')
        
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Avatar.Icon size={100} icon="account" style={styles.avatar} />
        <Text style={styles.username}>{userData.username}</Text>
        <Button
          mode="outlined"
          onPress={handleBecomeBroker}
          style={styles.becomeBrokerButton}
        >
          Become Broker
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
      {/* <PrizeBondTable /> */}
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

export default ProfileAdmin;
