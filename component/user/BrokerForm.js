import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for token storage
import { TextInput, Button, useTheme } from 'react-native-paper';
import COLORS from '../src/consts/color';

const BrokerForm = () => {
    const [experience, setExperience] = useState('');
    const [description, setDescription] = useState('');
    const { colors } = useTheme();

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
        try {
            // Validate form fields
            if (!experience.trim() || !description.trim()) {
                throw new Error('Experience and Description are required fields');
            }

            // Prepare request body
            const requestBody = {
                Experience: experience,
                Description: description
            };

            // Fetch token from state or context
            const token = await AsyncStorage.getItem('dataTypeToken');
            console.log('token for become broker',token);

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
            // Optionally, you can navigate to another screen or update state
        } catch (error) {
            // Handle error
            console.error('Error adding form:', error.message);
            Alert.alert('Error', 'Failed to add form. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TextInput
                label="Enter Experience"
                value={experience}
                onChangeText={text => setExperience(text)}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: COLORS.blue } }}
            />
            <TextInput
                label="Enter Description"
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
        marginBottom: 20,
        color:COLORS.blue
    },
    textArea: {
        width: '100%',
        marginBottom: 20,
    },
    button: {
        width: '100%',
    },
    buttonContent: {
        paddingVertical: 8,
    },
});

export default BrokerForm;
