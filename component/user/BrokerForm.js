import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for token storage
import { TextInput, Button, useTheme, Title, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation
import COLORS from '../src/consts/color';

const BrokerForm = () => {
    const [experience, setExperience] = useState('');
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(true); // State for the modal visibility
    const { colors } = useTheme();
    const navigation = useNavigation(); // Initialize useNavigation

    useEffect(() => {
        // Fetch token from AsyncStorage when component mounts
        fetchToken();
    }, []);

    const fetchToken = async () => {
        try {
            const token = await AsyncStorage.getItem('dataTypeToken');
            // Store token in state or context if needed
            // setToken(token);
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    const handleFormSubmit = async () => {
        // Validate form fields
        if (countWords(description) < 30) {
            Alert.alert('Validation Error', 'Description must be at least 30 words long.');
            return;
        }

        try {
            // Prepare request body
            const requestBody = {
                Experience: experience,
                Description: description
            };

            // Fetch token from state or context
            const token = await AsyncStorage.getItem('dataTypeToken');
            console.log('token for become broker', token);

            // Make API request with token in headers
            const response = await fetch('https://prize-bond-backend.vercel.app/api/v1/Form/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to add form');
            }

            const data = await response.json();
            console.log(data);
            // Handle successful response
            Alert.alert('Success', 'Form created successfully');
            // Navigate back to the previous screen
            navigation.goBack();
        } catch (error) {
            // Handle error
            console.error('Error adding form:', error.message);
            Alert.alert('Error', 'Failed to add form. Please try again.');
        }
    };

    const countWords = (text) => {
        return text.trim().split(/\s+/).length;
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Title style={styles.modalTitle}>Important Information</Title>
                        <Text style={styles.modalText}>
                            Please provide accurate and honest details in the fields below. 
                            This helps us process your form quickly and correctly. 
                            Your experience and description should be clear and precise.
                        </Text>
                        <Text style={styles.modalText}>
                            <Text style={styles.boldText}>Key Points:</Text>
                            {'\n'}• <Text style={styles.boldText}>Ensure that the experience you provide</Text> is truthful and relevant to the role.
                            {'\n'}• <Text style={styles.boldText}>The description should clearly highlight your skills and expertise.</Text>
                            {'\n'}• <Text style={styles.boldText}>Double-check all information for accuracy before submitting.</Text>
                            {'\n'}• <Text style={styles.boldText}>Any false or misleading information may result in form rejection.</Text>
                        </Text>
                        <Pressable
                            style={styles.modalButton}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.modalButtonText}>Got It</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <TextInput
                label="Experience"
                value={experience}
                onChangeText={text => setExperience(text)}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: COLORS.blue } }}
            />
            <TextInput
                label="Description"
                value={description}
                onChangeText={text => setDescription(text)}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.textArea}
                theme={{ colors: { primary: COLORS.blue } }}
            />
            <Button
                mode="contained"
                onPress={handleFormSubmit}
                style={styles.button}
                contentStyle={styles.buttonContent}
            >
                Submit Form
            </Button>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    input: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 1, // Add shadow to input
        padding: 10,
    },
    textArea: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 1, // Add shadow to textarea
        padding: 10,
    },
    button: {
        width: '100%',
        borderRadius: 8,
        marginTop: 20,
        backgroundColor: COLORS.blue,
    },
    buttonContent: {
        paddingVertical: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        elevation: 4, // Add shadow to modal
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.blue,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 15,
    },
    boldText: {
        fontWeight: 'bold',
    },
    modalButton: {
        backgroundColor: COLORS.blue,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default BrokerForm;
