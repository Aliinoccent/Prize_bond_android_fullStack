import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Keyboard,
  SafeAreaView,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../src/consts/color';
import STYLES from '../src/styles';
import { debounce } from 'lodash';

const BrokerStoreForm = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInput, setModalInput] = useState('');

  const fetchCitySuggestions = debounce(async (query) => {
    if (query.length < 1) {
      setCitySuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
       `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&filter=countrycode:pk&format=json&apiKey=17b2d4ab90904a148003571b5aecb162`  );
      const data = await response.json();
      const cities = data.results.map((item) => item.city || item.name);
      setCitySuggestions(cities);
    } catch (error) {
      console.error('Failed to fetch city suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    console.log('city' ,city);
  }, [city]||[number]);

  const handleCitySelect = (cityName) => {
    setCity(cityName);
    setCitySuggestions([]);
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const handleModalInputChange = (text) => {
    setModalInput(text);
    fetchCitySuggestions(text);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Description is required.');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Validation Error', 'City is required.');
      return;
    }
    if (!area.trim()) {
      Alert.alert('Validation Error', 'Area is required.');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('dataTypeToken');
      if (!token) {
        Alert.alert('Authorization Error', 'No token found. Please log in again.');
        return;
      }

      const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/Store/add', {
        method: 'POST',
        headers: {
          Authorization:` Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Description: description,
          city: city,
          area: area,
          number: number,
          email: email,
          Name: name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message || 'Store added successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to add store. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setModalInput('');
  };

  const closeModal = () => {
    setModalVisible(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="description" size={24} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={COLORS.lightGray}
            />
          </View>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={openModal}
          >
            <Icon name="location-city" size={24} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter City"
              value={city}
              editable={false}
              placeholderTextColor={COLORS.lightGray}
            />
            <Icon name="arrow-drop-down" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Modal for City Suggestions */}
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Search City"
                  value={modalInput}
                  onChangeText={handleModalInputChange}
                  autoFocus={true}
                />
                {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
                {citySuggestions.length > 0 ? (
                  <FlatList
                    data={citySuggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleCitySelect(item)}
                        style={styles.suggestionItem}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text style={styles.suggestionText}>No suggestions available</Text>
                )}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.inputContainer}>
            <Icon name="map" size={24} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Area"
              value={area}
              onChangeText={setArea}
              placeholderTextColor={COLORS.lightGray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="phone" size={24} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Number"
              value={number}
              onChangeText={setNumber}
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.lightGray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email" size={24} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={COLORS.lightGray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="person" size={24} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={COLORS.lightGray}
            />
          </View>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Add Store</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginBottom: 20,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.dark,
  },
  inputIcon: {
    marginRight: 10,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: '90%',
    maxHeight: '60%',
    padding: 20,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BrokerStoreForm;