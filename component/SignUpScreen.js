import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import COLORS from "./src/consts/color";
import STYLES from "./src/styles";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const SignUpScreen = ({ navigation }) => {
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "Username must be at least 2 characters")
      .max(50, "Username must be at most 50 characters")
      .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    fullname: Yup.string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be at most 50 characters")
      .required("Full name is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    number: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits")
      .required("Phone number is required"),
    Location: Yup.string()
      .min(2, "Location must be at least 2 characters")
      .max(50, "Location must be at most 50 characters")
      .required("Location is required"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema), 
  });

  onsubmit = async (data) => {
    data = { ...data, userType: "user" };
    console.log(data);
    try {
      const response = await fetch(
        "https://prize-bond-backend.vercel.app/api/v1/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
  
      if (response.ok) {
        const dataform = await response.json();
        console.log(dataform);
        navigation.navigate("signin");
      } else {
        const errorData = await response.json();
        console.log("Error from backend:", errorData.error);
        
        alert(errorData.error || "An error occurred");
      }
    } catch (error) {
      console.log("Fetch error:", error.error);
      alert("Network error: " + error.error);
    }
  };
  

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.textView}>
          <Text style={styles.logoOne}>P</Text>
          <Text style={[styles.logoOne, { color: COLORS.secondary }]}>
            rize Bond
          </Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={([styles.welcome], { color: COLORS.light })}>
            Sign up to Continue
          </Text>
        </View>
        <View>
          <View style={STYLES.inputContainer}>
            <Icon
              name="person"
              color={COLORS.light}
              size={20}
              style={STYLES.inputIcon}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholderTextColor="grey"
                  placeholder="Full Name"
                  style={STYLES.input}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
              name="fullname"
            />
            {errors.fullname && (
              <Text style={{ color: "red" }}>{errors.fullname.message}</Text>
            )}
          </View>
          <View style={STYLES.inputContainer}>
            <Icon
              name="person-outline"
              color={COLORS.light}
              size={20}
              style={STYLES.inputIcon}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholderTextColor="grey"
                  placeholder="Username"
                  style={STYLES.input}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
              name="username"
            />
            {errors.username && (
              <Text style={{ color: "red" }}>{errors.username.message}</Text>
            )}
          </View>
          <View style={STYLES.inputContainer}>
            <Icon
              name="location-on"
              color={COLORS.light}
              size={20}
              style={STYLES.inputIcon}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholderTextColor="grey"
                  placeholder="Location"
                  style={STYLES.input}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
              name="Location"
            />
            {errors.Location && (
              <Text style={{ color: "red" }}>{errors.Location.message}</Text>
            )}
          </View>
          <View style={STYLES.inputContainer}>
            <Icon
              name="phone"
              color={COLORS.light}
              size={20}
              style={STYLES.inputIcon}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholderTextColor="grey"
                  placeholder="Phone Number"
                  style={STYLES.input}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
              name="number"
            />
            {errors.number && (
              <Text style={{ color: "red" }}>{errors.number.message}</Text>
            )}
          </View>
          <View style={STYLES.inputContainer}>
            <Icon
              name="email"
              color={COLORS.light}
              size={20}
              style={STYLES.inputIcon}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholderTextColor="grey"
                  placeholder="Email"
                  style={STYLES.input}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text style={{ color: "red" }}>{errors.email.message}</Text>
            )}
          </View>
          <View style={STYLES.inputContainer}>
            <Icon
              name="lock"
              color={COLORS.light}
              size={20}
              style={STYLES.inputIcon}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholderTextColor="grey"
                  placeholder="Password"
                  style={STYLES.input}
                  onChangeText={field.onChange}
                  value={field.value}
                  secureTextEntry={true}
                />
              )}
              name="password"
            />
            {errors.password && (
              <Text style={{ color: "red" }}>{errors.password.message}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={STYLES.btnPrimary}
          onPress={handleSubmit(onsubmit)}
        >
          <Text style={STYLES.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.orline}>
          <View style={STYLES.line}></View>
          <Text style={{ marginHorizontal: 5, fontWeight: "bold",color:COLORS.blue }}>OR</Text>
          <View style={STYLES.line}></View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            marginTop: 5,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: COLORS.light, fontWeight: "bold" }}>
            Already have an account ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("signin")}>
            <Text style={{ color: COLORS.pink, fontWeight: "bold", color: 'red' }}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  textView: {
    flexDirection: "row",
    marginTop: 40,
    marginStart: 30,
  },
  logoOne: {
    lineHeight: 30,
    color: COLORS.dark,
    fontSize: 22,
    fontWeight: "bold",
  },
  title: {
    marginTop: 40,
    marginStart: 30,
  },
  welcome: {
    fontSize: 27,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  orline: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    marginVertical: 20,
  },
});

export default SignUpScreen;
