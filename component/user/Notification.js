import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const NotificationIcon = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Handle the notification press, such as navigating to a notifications screen
    navigation.navigate("Notification");
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 15 }}>
      <Icon name="notifications-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default NotificationIcon;
