import 'react-native-gesture-handler';
import { AppRegistry,RefreshControl } from 'react-native';
import {useState,useEffect} from 'react';
import { Esmart as Esmart } from './app.json';


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomepageLoginScreen from './Components/HomeScreen/LoginScreen';
import { OTPScreen } from './Components/HomeScreen/OtpScreen';
import { AdmissionSignup } from './Components/SignUpScreens/SignUp';
import BottomTabStack from './Components/HomePage/BottomTab';
import { AgentSignUp } from './Components/Agent/AgentSignUp';
import { PinScreen } from './Components/HomeScreen/PinScreen';
import { ValidateOtp } from './Components/HomeScreen/ValidateOtp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [LoginData, setLoginData] = useState(null)    

    async function getData() {
      const data = await AsyncStorage.getItem('isLoggedIn');
      const dataval = await AsyncStorage.getItem('LoginData');         
      setLoginData(JSON.parse(dataval))
      setIsLoggedIn(data);
    }

    useEffect(() => {
      getData()
    }, [LoginData!=null]);

  const LoginNav = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
          {/* <Stack.Screen name="RazorPay" component={RazorPay} />  */}
        <Stack.Screen name="Login" component={HomepageLoginScreen} /> 
        <Stack.Screen name="OTPScreen" component={OTPScreen} /> 
        <Stack.Screen name="AdmissionSignup" component={AdmissionSignup} />
        <Stack.Screen name="AgentSignUpFull" component={AgentSignUp} />
        <Stack.Screen name="BottomTabStack" component={BottomTabStack} />
        {/* <Stack.Screen name="AgentAdmissionDetailS" component={AdmissionDetail} /> 
        <Stack.Screen name="AdmissionOwnerDetails" component={AdmissionOwnerDetails} /> */}
        <Stack.Screen name="PinScreen" component={PinScreen} />
        <Stack.Screen name="ValidateOtp" component={ValidateOtp} /> 
      </Stack.Navigator>
    );
  };

  const DrawerNav = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName='BottomTabStack'
        >
        <Stack.Screen name="BottomTabStack" component={BottomTabStack} initialParams={{LoginData:LoginData}}/>
        <Stack.Screen name="OTPScreen" component={OTPScreen} /> 
        <Stack.Screen name="AdmissionSignup" component={AdmissionSignup} />
        <Stack.Screen name="AgentSignUpFull" component={AgentSignUp} />        
        <Stack.Screen name="Login" component={HomepageLoginScreen} /> 
        {/* <Stack.Screen name="AgentAdmissionDetailS" component={AdmissionDetail} /> 
        <Stack.Screen name="AdmissionOwnerDetails" component={AdmissionOwnerDetails} /> */}
        <Stack.Screen name="PinScreen" component={PinScreen} />
        <Stack.Screen name="ValidateOtp" component={ValidateOtp} /> 
      </Stack.Navigator>
    );
  };


  return (
    <NavigationContainer>
      {LoginData!=null?<DrawerNav/>:<LoginNav/>}
    </NavigationContainer>
  );
}



AppRegistry.registerComponent(Esmart, () => App);
