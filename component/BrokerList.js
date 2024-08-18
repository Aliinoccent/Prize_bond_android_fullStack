import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Professional icon library
import Loading from './loading/lodingIcon'; // Ensure this path is correct
import Modal from 'react-native-modal'; // Import the modal library
import COLORS from './src/consts/color'; // Import color constants

const BrokerList = () => {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pressedId, setPressedId] = useState(null); // Track which card is pressed
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchStores();
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
      setStores(prevStores => page === 1 ? data.data : [...prevStores, ...data.data]);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
      if (retryCount < 3) {
        setRetryCount(retryCount + 1);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setRefreshing(true);
    fetchStores();
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.footer}>
          <Loading /> {/* Use the Loading component here */}
        </View>
      );
    }
    if (error && stores.length === 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.errorText}>Error loading data. Please try again.</Text>
          <Button title="Retry" onPress={() => setRetryCount(retryCount + 1)} />
        </View>
      );
    }
    return null;
  };

  const handleCardPress = async (id) => {
    const token = await AsyncStorage.getItem('dataTypeToken');
    if (!token) {
      setModalMessage('Signin First');
      setIsModalVisible(true);
    } else {
      setSelectedId(id);
      navigation.navigate('StoreDetails', { storeId: id });
    }
  };

  const getInitial = (name) => {
    const firstWord = name.split(' ')[0]; // Get the first word
    return firstWord.charAt(0).toUpperCase(); // Return the first letter of the first word
  };

  return (
    <>
      {loading && page === 1 ? (
        <Loading />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item, index) => item._id ? `${item._id}-${index}` : `${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCardPress(item._id)}
              style={[styles.card, pressedId === item._id && styles.cardPressed]}
              onPressIn={() => setPressedId(item._id)} // Set pressed state
              onPressOut={() => setPressedId(null)} // Reset pressed state
            >
              <View style={styles.cardContent}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitial(item.Name)}</Text>
                  </View>
                </View>
                <View style={styles.divider} /> 
                <View style={styles.infoContainer}>
                  <Text style={styles.storeName}>{item.Name}</Text>
                  <View style={styles.row}>
                    <Icon name="description" size={20} color="#2980b9" style={styles.icon} />
                    <Text style={styles.storeDescription}>{item.Description}</Text>
                  </View>
                  <View style={styles.row}>
                    <Icon name="location-on" size={20} color="#2980b9" style={styles.icon} />
                    <Text style={styles.storeLocation}>{item.Location}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.container}
        />
      )}

      {/* Custom Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{modalMessage}</Text>
          <Pressable
            style={[styles.modalButton, styles.modalButtonSignIn]}
            onPress={() => {
              setIsModalVisible(false);
              navigation.navigate('signin');
            }}
          >
            <Text style={styles.modalButtonText}>Sign In</Text>
          </Pressable>
          <Pressable
            style={[styles.modalButton, styles.modalButtonCancel]}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'visible', // Allow shadow to be visible outside the card
  },
  cardPressed: {
    shadowColor: '#2980b9',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2980b9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 15,
  },
  infoContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  storeDescription: {
    fontSize: 15,
    color: '#7f8c8d',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  storeLocation: {
    fontSize: 15,
    color: '#95a5a6',
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black'
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonSignIn: {
    backgroundColor: '#2980b9', // Blue color for Sign In button
  },
  modalButtonCancel: {
    backgroundColor: COLORS.pink, // Red color for Cancel button
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BrokerList;
