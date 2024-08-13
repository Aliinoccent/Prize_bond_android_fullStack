import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import COLORS from "../../src/consts/color";
import STYLES from "../../src/styles";
import { useNavigation } from "@react-navigation/native";

const backgroundColor = COLORS.white
const foregroundColor = COLORS.blue;

const AdminScreen = () => {
  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            padding: 20,
            paddingTop: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "",
            }}
          >
            Price Bond Pro
          </Text>
          <Text style={{ marginLeft: "auto" }}>Logo</Text>
        </View>

        <View
          style={{
            padding: 20,
            paddingBottom: 30,
            marginTop: "auto",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "",
            }}
          >
            Admin
          </Text>
          <Text style={{ marginLeft: "auto" }}>amount</Text>
        </View>
      </View>
      <View style={styles.btnConatiner}>
        <Btn title="Manage List" onPress={() => navigation.navigate("upload list")} />
        <Btn title="Broker Requests" onPress={() => navigation.navigate("broker_request")} />
        <Btn title="Broker List" onPress={() => navigation.navigate("brokerlist")} />
        <Btn title="Profile" onPress={() => navigation.navigate("ProfileAdmin")} />
        <Btn title='lists_history' onPress={()=>navigation.navigate('lists_history')}/>

      </View>
    </View>
  );
};

const Btn = ({ title, onPress }) => {
  return <TouchableOpacity onPress={onPress}  >
    <Text style={{ color: COLORS.white, fontWeight: "bold" }}>{title}</Text>
  </TouchableOpacity >
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: backgroundColor,
  },
  header: {
    flex: 1,
  },
  btnConatiner: {
    height: "70%",
    flexDirection:'column',
    alignItems:'center',
    backgroundColor: foregroundColor,
    marginTop: "auto",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    padding: 30,
    gap: 14,
  },
  btn: {

  }
});

export default AdminScreen;
