import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import COLORS from "../../src/consts/color";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

const AdminScreen = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      
      <View style={styles.dashboardContainer}>
        {/* Card 1 - Manage List */}
        <View style={[styles.card, { backgroundColor: "#9b59b6" }]}>
          <View style={styles.cardContent}>
            <Icon name="list" size={30} color={COLORS.white} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Manage List</Text>
              <Text style={styles.cardText}>Manage your lists efficiently.</Text>
            </View>
            <TouchableOpacity 
              style={styles.cardButton} 
              onPress={() => navigateTo("upload list")}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2 - Broker Requests */}
        <View style={[styles.card, { backgroundColor: "#3498db" }]}>
          <View style={styles.cardContent}>
            <Icon name="users" size={30} color={COLORS.white} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Broker Requests</Text>
              <Text style={styles.cardText}>Handle broker requests.</Text>
            </View>
            <TouchableOpacity 
              style={styles.cardButton} 
              onPress={() => navigateTo("broker_request")}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 3 - Broker List */}
        <View style={[styles.card, { backgroundColor: "#e74c3c" }]}>
          <View style={styles.cardContent}>
            <Icon name="address-book" size={30} color={COLORS.white} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Broker List</Text>
              <Text style={styles.cardText}>View and manage broker list.</Text>
            </View>
            <TouchableOpacity 
              style={styles.cardButton} 
              onPress={() => navigateTo("brokerlist")}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 4 - Profile */}
        <View style={[styles.card, { backgroundColor: "#f39c12" }]}>
          <View style={styles.cardContent}>
            <Icon name="user" size={30} color={COLORS.white} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Profile</Text>
              <Text style={styles.cardText}>View and edit your profile.</Text>
            </View>
            <TouchableOpacity 
              style={styles.cardButton} 
              onPress={() => navigateTo("ProfileAdmin")}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 5 - Lists History */}
        <View style={[styles.card, { backgroundColor: "#2ecc71" }]}>
          <View style={styles.cardContent}>
            <Icon name="history" size={30} color={COLORS.white} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Lists History</Text>
              <Text style={styles.cardText}>Review your lists history.</Text>
            </View>
            <TouchableOpacity 
              style={styles.cardButton} 
              onPress={() => navigateTo("lists_history")}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.blue,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.grey,
  },
  dashboardContainer: {
    flexGrow: 1,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow radius for iOS
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.white,
    marginTop: 5,
  },
  cardButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-end", // Align button to the right
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.blue,
  },
});

export default AdminScreen;
