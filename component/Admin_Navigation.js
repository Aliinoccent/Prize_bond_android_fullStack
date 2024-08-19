import React, { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, StackRouter } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';

import AdminScreen from "./views/screens/adminScreen";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";
import BrokerRequest from "./BrokerRequest";
import BrokerList from "./BrokerList";
import UserScreen from "./UserScreen";
import GeastDashbord from "./GuestHomeScreen/guestDashbord";
import BondMain from './BondManue';
import ActiveRouteContext from "../hooks/ActiveRoute";
import UserAddBond from "./userAddBond";
import BondGet from "./Bondshow";
import ManageList from "./manage_list";
import DrawListShow from "./GuestHomeScreen/DrawListShow";
import ManualBondClik from "./GuestHomeScreen/MnualBondScreen";
import DatesList from "./Admin/dates lists";
import StoreDetails from "./StoreDetails";
import BrokerForm from "./user/BrokerForm";
import ProfileAdmin from "./user/Profileadmin";
import BrokerStoreForm from "./user/BrokerStorFrom";
import ManageStore from "./user/ManageStore";

import Profile from "./user/Profile";
import NotificationScreen from "./NotificationScreen";
import NotificationIcon from "./user/Notification";
import CustomHeader from "./header";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const screenOptions = {
  tabBarActiveTintColor: '#FF5B53',
  tabBarInactiveTintColor: 'white',
  tabBarStyle: { backgroundColor: '#073C5D' },
};

const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="User"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'User') {
            iconName = 'home';
          } else if (route.name === 'brokerlist') {
            iconName = 'list';
          } else if (route.name === 'BONDS DETAILS') {
            iconName = 'document-text';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
        ...screenOptions,
      })}
    >
      <Tab.Screen 
        name="User" 
        component={GeastDashbord} 
        options={{
          headerRight: () => <NotificationIcon />,
          // headerTitle: () => <CustomHeader />
        }}
      />
      <Tab.Screen 
        name="brokerlist" 
        component={BrokerList} 
        options={{
          headerRight: () => <NotificationIcon />,
          
        }}
      />
      <Tab.Screen 
        name="BONDS DETAILS" 
        component={BondMain} 
        options={{
          headerRight: () => <NotificationIcon />,
          
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          headerRight: () => <NotificationIcon />,
        }}
      />
    </Tab.Navigator>
  );
};



const UserNavigation = () => {
  return (
    <Stack.Navigator
    screenOptions={({ navigation }) => ({
      headerStyle: { backgroundColor: '#073C5D' },
      headerTintColor: '#fff',
      headerRight: () => <NotificationIcon />,
      // headerTitle: () => <CustomHeader />,
      headerTitleAlign: 'center',
      
    })}
  >
      <Stack.Screen
        name="MainTabs"
        component={UserTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="List" component={DrawListShow} />
      <Stack.Screen name="addBond" component={UserAddBond} />
      <Stack.Screen name="Bonds" component={BondGet} />
      <Stack.Screen name="Manual Bonds" component={ManualBondClik} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="StoreDetails" component={StoreDetails} />
      <Stack.Screen name="Broker Form" component={BrokerForm} />
      <Stack.Screen name="Broker Store Form" component={BrokerStoreForm} />
      <Stack.Screen name="Manage Stare" component={ManageStore} />
      <Stack.Screen name='Notification' component={NotificationScreen}/>
     
    </Stack.Navigator>
  );
};


const GuestDashbord = () => {
  return (
    <Tab.Navigator
      initialRouteName="GeastDashbord"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'GeastDashbord') {
            iconName = 'home';
          } else if (route.name === 'brokerlist') {
            iconName = 'list';
          } else if (route.name === 'signin') {
            iconName = 'log-in';
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
        ...screenOptions,
      })}
    >
      <Tab.Screen name="GeastDashbord" component={GeastDashbord} />
      <Tab.Screen name="brokerlist" component={BrokerList} />
      <Tab.Screen name="signin" component={SignInScreen} />
    </Tab.Navigator>
  );
};
const GuestStack = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#073C5D' },
        headerTintColor: '#fff',
        // headerTitle: () => <CustomHeader />
      }}


    >
      <Stack.Screen
        name="MainTabs"
        component={GuestDashbord}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} />

      <Stack.Screen name="List" component={DrawListShow} />
      <Stack.Screen name="addBond" component={UserAddBond} />
      <Stack.Screen name="Bonds" component={BondGet} />
      <Stack.Screen name="Manual Bonds" component={ManualBondClik} />
      <Stack.Screen name='StoreDetails' component={StoreDetails} />
      <Stack.Screen name="Broker Form" component={BrokerForm} />

    </Stack.Navigator>)

}


const AdminNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#073C5D' },
        headerTintColor: '#fff',
        
      })}
    >
      <Stack.Screen name="admin" component={AdminScreen} />
      <Stack.Screen name="upload list" component={ManageList} />
      <Stack.Screen name="userdashbord" component={UserScreen} />
      <Stack.Screen name="brokerlist" component={BrokerList} />
      <Stack.Screen name="broker_request" component={BrokerRequest} />
      <Stack.Screen name="signin" component={SignInScreen} />
      <Stack.Screen name='lists_history' component={DatesList} />
      <Stack.Screen name='StoreDetails' component={StoreDetails} />
      <Stack.Screen name='ProfileAdmin' component={ProfileAdmin} />
      
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const [activeRoute, setActiveRoute] = useContext(ActiveRouteContext);

  const manageNavigation = async () => {
    try {
      const token = await AsyncStorage.getItem('dataTypeToken');
      if (token) {
        const parseToken = JSON.parse(token);
        if (parseToken.userType === 'admin') {
          setActiveRoute('Admin');
        } else if (parseToken.userType === 'user') {
          setActiveRoute('user');
        }
        else if(parseToken.userType ==='broker'){
          setActiveRoute('broker')
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  useEffect(() => {
    manageNavigation();
  }, []);

  return (
    <NavigationContainer>
      {activeRoute === 'Admin' ? <AdminNavigation /> :
        activeRoute === 'user' ? <UserNavigation />:
        activeRoute === 'broker'?<UserNavigation/>: 
        <GuestStack />
      }
    </NavigationContainer>
  );
};

export default Navigation;