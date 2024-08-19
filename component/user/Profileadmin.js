import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, useTheme, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../src/consts/color';
import ActiveRouteContext from '../../hooks/ActiveRoute';
import Loading from '../loading/lodingIcon'; // Import the Loading component

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
        if (!token) throw new Error('No token found');

        const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/users/currentUser', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

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
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Get the first letter of the username
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        {userData.avatarUrl ? (
          <Avatar.Image size={120} source={{ uri: userData.avatarUrl }} style={styles.avatar} />
        ) : (
          <Avatar.Text size={120} label={getInitials(userData.username)} style={styles.avatar} />
        )}
        <Text style={styles.username}>{userData.username}</Text>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoContainer}>
            <Icon name="mail-outline" size={24} color={COLORS.blue} />
            <Text style={styles.infoText}>{userData.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="location-outline" size={24} color={COLORS.blue} />
            <Text style={styles.infoText}>{userData.Location}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="call-outline" size={24} color={COLORS.blue} />
            <Text style={styles.infoText}>{userData.number}</Text>
          </View>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton} labelStyle={styles.logoutButtonText}>
        Log Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.lightGray,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: COLORS.lightBlue,
    marginBottom: 15,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkBlue,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    marginBottom: 30,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    color: COLORS.darkGray,
    fontSize: 18,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  error: {
    color: COLORS.red,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileAdmin;
