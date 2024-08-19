import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from './loading/lodingIcon'; 
import Modal from 'react-native-modal'; 
import COLORS from './src/consts/color'; 

const BrokerList = () => {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pressedId, setPressedId] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [modalMessage, setModalMessage] = useState('');
  const [query, setQuery] = useState(''); 
  const [citySuggestions, setCitySuggestions] = useState([]); 
  const [selectedCity, setSelectedCity] = useState(''); 
  const navigation = useNavigation();

  useEffect(() => {
    fetchStores();
  }, [page, retryCount, selectedCity]);

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/Store/getAllStore?page=${page}&location=${selectedCity}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStores(prevStores => page === 1 ? data.data : [...prevStores, ...data.data]);
      setTotalPages(data.totalPages);
      console.log(data);

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

  const fetchCitySuggestions = async (query) => {
    if (query.trim() === '') {
      setCitySuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&filter=countrycode:pk&format=json&apiKey=17b2d4ab90904a148003571b5aecb162`);
      const data = await response.json();
      setCitySuggestions(data.results);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setQuery(city); 
    setCitySuggestions([]); 
    setPage(1); 
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
                <Loading />
            </View>
        );
    }
    if (error && stores.length === 0 && query.length > 0) { 
        return (
            <View style={styles.footer}>
                <Text style={styles.errorText}>Error loading data. Please try again.</Text>
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
    const firstWord = name.split(' ')[0]; 
    return firstWord.charAt(0).toUpperCase(); 
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter city name"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            fetchCitySuggestions(text);
          }}
        />
        {citySuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {citySuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleCitySelect(suggestion.city)}
              >
                <Text style={styles.suggestionText}>{suggestion.city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

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
              onPressIn={() => setPressedId(item._id)}
              onPressOut={() => setPressedId(null)}
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
                    <Text style={styles.storeLocation}>{item.Area}, {item.City}</Text>
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
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchInput: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  suggestionText: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#dcdcdc', 
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    backgroundColor: '#dcdcdc', 
    height: '100%',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    marginRight: 8,
  },
  storeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  storeLocation: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  footer: {
    paddingVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonSignIn: {
    backgroundColor: COLORS.primary,
  },
  modalButtonCancel: {
    backgroundColor: COLORS.pink,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BrokerList;
