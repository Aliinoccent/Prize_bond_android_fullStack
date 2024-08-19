import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import COLORS from "./src/consts/color";
import STYLES from "./src/styles";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActiveRouteContext from "../hooks/ActiveRoute";
import Loading from "./loading/lodingIcon";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icons you want to use

const SignInScreen = () => {
  const navigation = useNavigation();
  const [, setActiveRoute] = useContext(ActiveRouteContext);
  const [loading, setLoading] = useState(false);

  const schema = Yup.object({
    email: Yup.string().email().required("Required email"),
    password: Yup.string().required("Password required"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
  
    try {
      const response = await fetch(
        "https://prize-bond-backend.vercel.app/api/v1/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
  
      const contentType = response.headers.get("Content-Type");
  
      if (response.ok) {
        const responseData = await response.json();
        const userObject = {
          userType: responseData.data.user.userType,
          Token: responseData.data.accessToken,
        };
  
        if (userObject.userType === "admin") {
          await StoreData(userObject);
          setActiveRoute("Admin");
        } else if (["user", "broker"].includes(userObject.userType)) {
          await StoreData(userObject);
          setActiveRoute("user");
        }
      } else {
        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
          Alert.alert("Error", responseData.error || "Something went wrong");
        } else {
          const errorText = await response.text();
          console.log("Non-JSON error response:", errorText);
          Alert.alert("Error", "Unexpected error occurred");
        }
      }
    } catch (error) {
      console.log('Caught error:', error);
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  const StoreData = async (token) => {
    try {
      const existingData = await AsyncStorage.getItem("dataTypeToken");
      const parsedData = existingData ? JSON.parse(existingData) : null;

      if (
        !parsedData ||
        parsedData.Token !== token.Token ||
        parsedData.userType !== token.userType
      ) {
        await AsyncStorage.setItem("dataTypeToken", JSON.stringify(token));
      }
    } catch (error) {
      console.log("Error storing data", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.textView}>
          <Text style={[styles.logoOne, { fontSize: 25 }]}>P</Text>
          <Text style={[styles.logoOne, { color: COLORS.secondary }]}>
            rize Bond
          </Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={[styles.welcome, { color: COLORS.light }]}>
            Sign in to Continue
          </Text>
        </View>

        <View style={[STYLES.inputContainer, styles.marginVertical]}>
          <View style={styles.inputWithIcon}>
            <Icon name="email" size={24} color="grey" style={styles.icon} />
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="grey"
                  style={[STYLES.input, { color: "black", flex: 1 }]}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
              name="email"
            />
          </View>
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        <View style={[STYLES.inputContainer, styles.marginVertical]}>
          <View style={styles.inputWithIcon}>
            <Icon name="lock" size={24} color="grey" style={styles.icon} />
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="grey"
                  style={[STYLES.input, { flex: 1 }]}
                  secureTextEntry
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
              name="password"
            />
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[STYLES.btnPrimary, styles.marginVertical]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={STYLES.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={[styles.orline, styles.marginVertical]}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.signupContainer}>
          <Text style={{ color: COLORS.light, fontWeight: "bold" }}>
            Don’t have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUpScreen")}
          >
            <Text style={{ color: COLORS.pink, fontWeight: "bold", marginLeft: 5 }}>
              SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  textView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logoOne: {
    fontSize: 30,
    fontWeight: "bold",
  },
  title: {
    alignItems: "center",
    marginTop: 20,
  },
  welcome: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  orline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  orText: {
    marginHorizontal: 10,
    fontWeight: "bold",
    color: "black",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  marginVertical: {
    marginVertical: 10,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
});

export default SignInScreen;
