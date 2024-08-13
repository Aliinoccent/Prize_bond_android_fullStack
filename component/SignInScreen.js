import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import COLORS from "./src/consts/color";
import STYLES from "./src/styles";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import styles from "./src/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navigation from "./Admin_Navigation";
import ActiveRouteContext from "../hooks/ActiveRoute";
import { useContext } from "react";


// import Icon from 'react-native-vector-icons/MaterialIcons';

const SignInScreen = () => {
  const navigation = useNavigation();

  const [, setActiveRoute] = useContext(ActiveRouteContext)

  const schma = Yup.object({
    email: Yup.string().email().required("required email"),
    password: Yup.string().required("password required"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schma),
  });

  const onsubmit = async (data) => {
    console.log(data);
    try {
      Response = await fetch(
        "https://prize-bond-backend.vercel.app/api/v1/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),

        }
      );
      if (Response.ok) {
        console.log(Response.status);
        const dataform = await Response.json();
        console.log(dataform.data.user.userType);//user type admin or user
        const userObject = {
          userType: dataform.data.user.userType,
          Token: dataform.data.accessToken
        };
        if (Response.status === 200 && userObject.userType == "admin") {

          console.log('updat token =', userObject.Token);
          console.log('user type', userObject.userType)

          StoreData(userObject)// store data in storage as object
          setActiveRoute('Admin')

        }
        else
          if (Response.status === 200 && userObject.userType == "user" || userObject.userType=='broker') {
            StoreData(userObject);
            setActiveRoute('user')

          }
      }
      else {
        throw Error("network error");
      }
    }
    catch {
      console.log("fatch error", Response.status);
      Alert.alert("invalid password or email");
    }
  };
  const StoreData = async (token) => {
    console.log('data type=', token.userType);

    try {
      let i = 1;
      if (i === 1) {
        await AsyncStorage.setItem('dataTypeToken',
          JSON.stringify(token))
        i++
        console.log('iiiiiiii has increament one time ', i)
      }
      const data = await AsyncStorage.getItem('dataTypeToken')
      let parsedData = JSON.parse(data);
      console.log('user type in store mathod =', parsedData.userType);
      if (parsedData.Token == token.Token && parsedData.userType == token.userType) {
        console.log('already token =', parsedData.Token)
      }
      else {
        await AsyncStorage.setItem('dataTypeToken',
          JSON.stringify(token)
        )
        console.log('data is set asynic_________________________ =')
      }
    } catch (error) {
      console.log('errors ', error)
    }
  }
  return (
    <SafeAreaView style={styles.body}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.textView}>
          <Text style={[styles.logoOne,{fontSize:25}]}>P</Text>
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

        <View style={STYLES.inputContainer}>
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Email"
                placeholderTextColor="grey"
                style={[STYLES.input,{color:'black'}]}
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
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput 
                placeholder="Password"
                placeholderTextColor="grey"
                style={STYLES.input}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={{ color: "red", }}>{errors.password.message}</Text>
          )}
        </View>
        <TouchableOpacity
          style={STYLES.btnPrimary}
          onPress={handleSubmit(onsubmit)}
        >
          <Text style={STYLES.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.orline}>
          <View style={STYLES.line}></View>
          <Text style={{ marginHorizontal: 5, fontWeight: "bold",color:'black' }}>OR</Text>
          <View style={STYLES.line}></View>
        </View>

        <View
          style={{
            marginHorizontal: 30,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: COLORS.light, fontWeight: "bold" }}>
            Don`t have an account ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
            <Text style={{ color: COLORS.pink, fontWeight: "bold" }}>
              SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default SignInScreen;
