import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import COLORS from "../src/consts/color";

const Loading = () => {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size={80} color={COLORS.pink} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});

export default Loading;
